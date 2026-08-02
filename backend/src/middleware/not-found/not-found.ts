import { Request, Response, NextFunction } from "express";

import { NotFoundError } from "../../common/errors";

export const notFoundMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
};