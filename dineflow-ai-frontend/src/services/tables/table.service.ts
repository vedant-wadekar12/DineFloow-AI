import apiClient from "@/services/api/api-client";

import type {
  RestaurantTable,
  CreateTableData,
  UpdateTableData,
} from "@/types/table.types";

interface TableListResponse {
  tables: RestaurantTable[];
  total?: number;
}

export async function getTables(
  floorId?: string,
): Promise<RestaurantTable[]> {
  const response =
    await apiClient.get<
      TableListResponse | RestaurantTable[]
    >("/tables", {
      params: floorId
        ? { floorId }
        : undefined,
    });

  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  return data.tables ?? [];
}

export async function getTable(
  tableId: string,
): Promise<RestaurantTable> {
  const response =
    await apiClient.get<RestaurantTable>(
      `/tables/${tableId}`,
    );

  return response.data;
}

export async function createTable(
  data: CreateTableData,
): Promise<RestaurantTable> {
  const response =
    await apiClient.post<RestaurantTable>(
      "/tables",
      data,
    );

  return response.data;
}

export async function updateTable(
  tableId: string,
  data: UpdateTableData,
): Promise<RestaurantTable> {
  const response =
    await apiClient.patch<RestaurantTable>(
      `/tables/${tableId}`,
      data,
    );

  return response.data;
}

export async function deleteTable(
  tableId: string,
): Promise<void> {
  await apiClient.delete(
    `/tables/${tableId}`,
  );
}

export async function updateTableStatus(
  tableId: string,
  status:
    | "AVAILABLE"
    | "OCCUPIED"
    | "RESERVED"
    | "INACTIVE",
): Promise<RestaurantTable> {
  const response =
    await apiClient.patch<RestaurantTable>(
      `/tables/${tableId}/status`,
      { status },
    );

  return response.data;
}