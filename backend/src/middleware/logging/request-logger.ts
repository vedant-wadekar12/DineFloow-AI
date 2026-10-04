import crypto from "node:crypto";
import { NextFunction, Request, Response } from "express";

import { logger } from "../../config";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId =
    (req.headers["x-request-id"] as string) ||
    crypto.randomUUID();

  (req as any).id = requestId;
  res.setHeader("X-Request-ID", requestId);

  logger.info(`[${requestId}] ${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    logger.info(
      `[${requestId}] ${req.method} ${req.originalUrl} ${res.statusCode}`
    );
  });

  next();
};