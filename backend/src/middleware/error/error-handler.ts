import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../common/responses";
import { AppError } from "../../common/errors";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(
      new ApiResponse(
        false,
        error.message,
        null,
        null,
        null
      )
    );
  }

  console.error(error);

  return res.status(500).json(
    new ApiResponse(
      false,
      "Internal Server Error",
      null,
      null,
      null
    )
  );
};