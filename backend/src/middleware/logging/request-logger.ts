import { NextFunction, Request, Response } from "express";

import { logger } from "../../config";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode}`
    );
  });

  next();
};