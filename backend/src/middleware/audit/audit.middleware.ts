import { NextFunction, Request, Response } from "express";

export const auditMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next();
};