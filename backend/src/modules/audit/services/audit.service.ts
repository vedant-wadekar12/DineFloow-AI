import {
  AuditRepository,
} from "../repositories/audit.repository";

export interface CreateAuditInput {
  userId?: string;

  restaurantId?: string;

  branchId?: string;

  action: string;

  resource: string;

  resourceId?: string;

  method: string;

  path: string;

  ipAddress?: string;

  userAgent?: string;

  oldValues?: Record<
    string,
    unknown
  >;

  newValues?: Record<
    string,
    unknown
  >;

  metadata?: Record<
    string,
    unknown
  >;
}

export class AuditService {
  constructor(
    private readonly repository =
      new AuditRepository()
  ) {}

  async createAudit(
    data: CreateAuditInput
  ) {
    return this.repository.create(
      data
    );
  }

  async getAudit(
    auditId: string
  ) {
    return this.repository.findById(
      auditId
    );
  }

  async getAudits(
    filter: Record<string, unknown>,
    page = 1,
    limit = 50
  ) {
    const skip =
      (page - 1) * limit;

    const [
      data,
      total,
    ] = await Promise.all([
      this.repository.findMany(
        filter,
        skip,
        limit
      ),

      this.repository.count(
        filter
      ),
    ]);

    return {
      data,

      pagination: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(
            total / limit
          ),
      },
    };
  }
}