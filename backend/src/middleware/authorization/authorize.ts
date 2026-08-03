import { NextFunction, Request, Response } from "express";

export const authorize =
  (..._permissions: string[]) =>
  (
    _req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    /**
     * RBAC
     * Stage 8
     */

    next();
  };