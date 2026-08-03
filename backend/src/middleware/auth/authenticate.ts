import { NextFunction, Request, Response } from "express";

export const authenticate = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  /**
   * JWT Verification
   * Stage 7
   */

  next();
};