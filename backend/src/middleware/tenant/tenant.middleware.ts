import { NextFunction, Request, Response } from "express";

export const tenantMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  /**
   * Stage 9
   * Restaurant will be identified here.
   */

  next();
};