import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";

import { AppError } from "../../common/errors";
import { logger } from "../../config";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requestId = (req as any).id;
  logger.error(`[${requestId || "NO_REQ_ID"}] ${err.stack || err.message}`);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      requestId,
      errors: err.flatten(),
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: "Invalid resource identifier.",
      requestId,
    });
  }

  if ((err as any).code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A resource with the same unique value already exists.",
      requestId,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      requestId,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    requestId,
  });
};