import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  BadRequestError,
} from "../../../common/errors";

import {
  AuditService,
} from "../services/audit.service";

import {
  auditQuerySchema,
} from "../validators/audit.validator";

export class AuditController {
  constructor(
    private readonly service =
      new AuditService()
  ) {}

  getAudits = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsed =
        auditQuerySchema.safeParse(
          req.query
        );

      if (!parsed.success) {
        throw new BadRequestError(
          parsed.error.issues
            .map(
              (issue) =>
                issue.message
            )
            .join(", ")
        );
      }

      const {
        page,
        limit,
        ...filter
      } = parsed.data;

      const result =
        await this.service.getAudits(
          filter,
          page,
          limit
        );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  getAudit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const auditId =
        String(
          req.params.auditId
        );

      const audit =
        await this.service.getAudit(
          auditId
        );

      res.status(200).json({
        success: true,
        data: audit,
      });
    } catch (error) {
      next(error);
    }
  };
}