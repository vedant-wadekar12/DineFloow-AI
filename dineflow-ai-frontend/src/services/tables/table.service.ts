import apiClient from "@/services/api/api-client";

import type {
  RestaurantTable,
  CreateTableData,
  UpdateTableData,
} from "@/types/table.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface TableListResponse {
  tables: RestaurantTable[];
  total?: number;
}

type ApiTable = RestaurantTable & {
  _id?: string;
};

function normalizeTable(
  table: ApiTable,
): RestaurantTable {
  return {
    ...table,
    id: table.id || table._id || "",
  };
}

function normalizeTables(
  tables: ApiTable[],
): RestaurantTable[] {
  return tables.map(normalizeTable);
}

function unwrapData<T>(
  data: T | ApiResponse<T>,
): T {
  if (
    data &&
    typeof data === "object" &&
    "success" in data &&
    "data" in data
  ) {
    return (data as ApiResponse<T>).data;
  }

  return data as T;
}

/*
 * Get tables for a floor.
 */
export async function getTables(
  floorId?: string,
): Promise<RestaurantTable[]> {
  if (!floorId) {
    return [];
  }

  const response =
    await apiClient.get<
      ApiTable[] |
      TableListResponse |
      ApiResponse<
        ApiTable[] |
        TableListResponse
      >
    >(
      `/tables/floor/${floorId}`,
    );

  const data =
    unwrapData(response.data);

  if (Array.isArray(data)) {
    return normalizeTables(data);
  }

  return normalizeTables(
    data.tables ?? [],
  );
}

/*
 * Get one table.
 */
export async function getTable(
  tableId: string,
): Promise<RestaurantTable> {
  const response =
    await apiClient.get<
      ApiTable |
      ApiResponse<ApiTable>
    >(
      `/tables/${tableId}`,
    );

  const data =
    unwrapData(response.data);

  return normalizeTable(data);
}

/*
 * Create table.
 *
 * Backend accepts:
 * branchId
 * floorId
 * name
 * tableNumber
 * capacity
 * position
 *
 * Frontend-only fields such as:
 * restaurantId
 * type
 * description
 *
 * are not sent.
 */
export async function createTable(
  data: CreateTableData,
): Promise<RestaurantTable> {
  const payload = {
    branchId: data.branchId,
    floorId: data.floorId,
    name: data.name,
    tableNumber: data.tableNumber,
    capacity: data.capacity,
    position: data.position,
  };

  const response =
    await apiClient.post<
      ApiTable |
      ApiResponse<ApiTable>
    >(
      "/tables",
      payload,
    );

  const result =
    unwrapData(response.data);

  return normalizeTable(result);
}

/*
 * Update table.
 */
export async function updateTable(
  tableId: string,
  data: UpdateTableData,
): Promise<RestaurantTable> {
  if (!tableId) {
    throw new Error(
      "Cannot update table: table ID is missing.",
    );
  }

  const payload = {
    name: data.name,
    tableNumber: data.tableNumber,
    capacity: data.capacity,
    position: data.position,
  };

  const response =
    await apiClient.patch<
      ApiTable |
      ApiResponse<ApiTable>
    >(
      `/tables/${tableId}`,
      payload,
    );

  const result =
    unwrapData(response.data);

  return normalizeTable(result);
}

/*
 * Delete table.
 */
export async function deleteTable(
  tableId: string,
): Promise<void> {
  if (!tableId) {
    throw new Error(
      "Cannot delete table: table ID is missing.",
    );
  }

  await apiClient.delete(
    `/tables/${tableId}`,
  );
}

/*
 * Update table status.
 */
export async function updateTableStatus(
  tableId: string,
  status:
    | "AVAILABLE"
    | "OCCUPIED"
    | "RESERVED"
    | "CLEANING"
    | "OUT_OF_SERVICE",
): Promise<RestaurantTable> {
  if (!tableId) {
    throw new Error(
      "Cannot update table status: table ID is missing.",
    );
  }

  const response =
    await apiClient.patch<
      ApiTable |
      ApiResponse<ApiTable>
    >(
      `/tables/${tableId}/status`,
      {
        status,
      },
    );

  const result =
    unwrapData(response.data);

  return normalizeTable(result);
}

/*
 * Update table active status.
 */
export async function updateTableActiveStatus(
  tableId: string,
  isActive: boolean,
): Promise<RestaurantTable> {
  if (!tableId) {
    throw new Error(
      "Cannot update table active status: table ID is missing.",
    );
  }

  const response =
    await apiClient.patch<
      ApiTable |
      ApiResponse<ApiTable>
    >(
      `/tables/${tableId}/active-status`,
      {
        isActive,
      },
    );

  const result =
    unwrapData(response.data);

  return normalizeTable(result);
}