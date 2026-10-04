import { Request, Response, NextFunction } from "express";
import { redisConnection } from "../../queues/redis.connection";
import { logger } from "../../config";

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyPrefix: string;
  failClosed?: boolean;
  keyGenerator?: (req: Request) => string;
}

export const createRedisRateLimiter = (options: RateLimitOptions) => {
  const { windowMs, max, keyPrefix, failClosed = false, keyGenerator } = options;
  const windowSec = Math.ceil(windowMs / 1000);

  return async (req: Request, res: Response, next: NextFunction) => {
  // Do not apply the global API limiter during automated tests.
  // Production/staging rate limiting remains unchanged.
  if (
    process.env.NODE_ENV === "test" &&
    keyPrefix === "api"
  ) {
    return next();
  }

  const requestId = (req as any).id;
    const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const user = (req as any).user;

    const identifier = keyGenerator
      ? keyGenerator(req)
      : user?.restaurantId
      ? `tenant:${user.restaurantId}:${ip}`
      : `ip:${ip}`;

    const redisKey = `rl:${keyPrefix}:${identifier}`;

    // If Redis is not ready, fail-open (or fail-closed for critical endpoints if specified)
    if (redisConnection.status !== "ready") {
      if (failClosed && process.env.NODE_ENV === "production") {
        return res.status(503).json({
          success: false,
          message: "Rate limiting service temporarily unavailable.",
          requestId,
        });
      }
      return next();
    }

    try {
      const current = await redisConnection.incr(redisKey);

      if (current === 1) {
        await redisConnection.expire(redisKey, windowSec);
      }

      const ttl = await redisConnection.ttl(redisKey);
      const resetTime = Math.max(0, ttl);

      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, max - current));
      res.setHeader("X-RateLimit-Reset", resetTime);

      if (current > max) {
        res.setHeader("Retry-After", resetTime);
        logger.warn(
          `[${requestId || "NO_REQ_ID"}] Rate limit exceeded for ${redisKey} (${current}/${max})`
        );
        return res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
          requestId,
          retryAfterSeconds: resetTime,
        });
      }

      next();
    } catch (error) {
      logger.error(
        `[${requestId || "NO_REQ_ID"}] Redis Rate Limiter Error for ${redisKey}:`,
        error
      );

      if (failClosed && process.env.NODE_ENV === "production") {
        return res.status(503).json({
          success: false,
          message: "Rate limiting service temporarily unavailable. Please retry.",
          requestId,
        });
      }

      next();
    }
  };
};

export const apiRateLimiter = createRedisRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyPrefix: "api",
  failClosed: false,
});

export const authRateLimiter = createRedisRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  keyPrefix: "auth",
  failClosed: true,
  keyGenerator: (req) => `ip:${req.ip || "127.0.0.1"}`,
});

export const passwordResetRateLimiter = createRedisRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyPrefix: "pwreset",
  failClosed: true,
  keyGenerator: (req) => `ip:${req.ip || "127.0.0.1"}`,
});

export const webhookRateLimiter = createRedisRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  keyPrefix: "webhook",
  failClosed: false,
  keyGenerator: (req) => `ip:${req.ip || "127.0.0.1"}`,
});
