import { passwordResetRateLimiter } from "../rate-limit/redis-rate-limiter";

/**
 * Redis-backed distributed rate limiter for password reset endpoints.
 * Works correctly across all PM2 cluster instances.
 * Falls back gracefully (fail-closed) if Redis is offline.
 */
export { passwordResetRateLimiter as passwordResetRateLimit };