import { Response } from "express";

import { ApiResponse } from "../responses";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: object
) => {
  return res.status(statusCode).json(
    new ApiResponse(
      true,
      message,
      data ?? null,
      meta ?? null,
      null
    )
  );
};