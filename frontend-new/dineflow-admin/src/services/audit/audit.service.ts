import apiClient from "@/services/api/api-client";

export interface AuditEvent {
  _id?: string;
  id?: string;
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
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditFilters {
  restaurantId?: string;
  branchId?: string;
  userId?: string;
  resource?: string;
  action?: string;
  page?: number;
  limit?: number;
}

export interface AuditListResponse {
  data: AuditEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface BackendAuditResponse {
  success?: boolean;
  data?: unknown;
  pagination?: Partial<AuditListResponse["pagination"]>;
}

export async function getAudits(
  filters: AuditFilters = {},
): Promise<AuditListResponse> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );

  const response = await apiClient.get<BackendAuditResponse>("/audit", {
    params,
  });

  const payload = response.data;

  if (!payload || !Array.isArray(payload.data)) {
    throw new Error(
      "The audit API returned an unexpected response format.",
    );
  }

  const pagination = payload.pagination;

  return {
    data: payload.data as AuditEvent[],
    pagination: {
      page: pagination?.page ?? filters.page ?? 1,
      limit: pagination?.limit ?? filters.limit ?? 50,
      total: pagination?.total ?? payload.data.length,
      totalPages:
        pagination?.totalPages ??
        (pagination?.total && pagination?.limit
          ? Math.ceil(pagination.total / pagination.limit)
          : payload.data.length > 0
            ? 1
            : 0),
    },
  };
}