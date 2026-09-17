import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuditService } from "../../modules/audit/services/audit.service";

const auditService = new AuditService();

export const auditMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startedAt = Date.now();

  res.on("finish", async () => {
    try {
      const user = (
        req as Request & {
          user?: {
            userId?: string;
            restaurantId?: string;
            branchId?: string;
          };
        }
      ).user;

      const resource =
        req.baseUrl
          .replace(/^\/+/, "")
          .split("/")[0] || "unknown";

      const resourceId =
        typeof req.params.id === "string"
          ? req.params.id
          : undefined;

      await auditService.createAudit({
        userId: user?.userId,
        restaurantId: user?.restaurantId,
        branchId: user?.branchId,

        action: `${req.method}:${res.statusCode}`,

        resource,

        resourceId,

        method: req.method,

        path: req.originalUrl,

        ipAddress:
          req.ip ??
          req.socket.remoteAddress,

        userAgent:
          req.get("user-agent"),

        metadata: {
          statusCode: res.statusCode,
          durationMs:
            Date.now() - startedAt,
        },
      });
    } catch (error) {
      console.error(
        "Audit logging failed:",
        error
      );
    }
  });

  next();
};