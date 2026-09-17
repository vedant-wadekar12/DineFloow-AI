import {
  AuditLog,
  IAuditLog,
} from "../models/audit-log.model";

export class AuditRepository {
  async create(
    data: Partial<IAuditLog>
  ) {
    return AuditLog.create(data);
  }

  async findById(
    auditId: string
  ) {
    return AuditLog.findById(
      auditId
    ).lean();
  }

  async findMany(
    filter: Record<string, unknown>,
    skip = 0,
    limit = 50
  ) {
    return AuditLog.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async count(
    filter: Record<string, unknown>
  ) {
    return AuditLog.countDocuments(
      filter
    );
  }
}