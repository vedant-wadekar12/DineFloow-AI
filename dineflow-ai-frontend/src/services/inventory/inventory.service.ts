import apiClient from "@/services/api/api-client";

import type {
  CreateInventoryData,
  InventoryItem,
  StockAdjustmentData,
  UpdateInventoryData,
} from "@/types/inventory.types";

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

function unwrap<T>(
  value: T | ApiResponse<T>,
): T {
  if (
    value &&
    typeof value === "object" &&
    "data" in value
  ) {
    const data =
      (value as ApiResponse<T>).data;

    if (data !== undefined) {
      return data;
    }
  }

  return value as T;
}

export async function getInventory(
  restaurantId?: string,
): Promise<InventoryItem[]> {
  const response =
    await apiClient.get<
      InventoryItem[] |
      ApiResponse<InventoryItem[]> |
      { items?: InventoryItem[] }
    >("/inventory", {
      params: restaurantId
        ? { restaurantId }
        : undefined,
    });

  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (
    "data" in data &&
    Array.isArray(data.data)
  ) {
    return data.data;
  }

  if (
    "items" in data &&
    Array.isArray(data.items)
  ) {
    return data.items;
  }

  return [];
}

export async function getInventoryById(
  inventoryId: string,
): Promise<InventoryItem> {
  const response =
    await apiClient.get<
      InventoryItem |
      ApiResponse<InventoryItem>
    >(`/inventory/${inventoryId}`);

  return unwrap(response.data);
}

export async function createInventory(
  data: CreateInventoryData,
): Promise<InventoryItem> {
  const response =
    await apiClient.post<
      InventoryItem |
      ApiResponse<InventoryItem>
    >("/inventory", data);

  return unwrap(response.data);
}

export async function updateInventory(
  inventoryId: string,
  data: UpdateInventoryData,
): Promise<InventoryItem> {
  const response =
    await apiClient.patch<
      InventoryItem |
      ApiResponse<InventoryItem>
    >(
      `/inventory/${inventoryId}`,
      data,
    );

  return unwrap(response.data);
}

export async function deleteInventory(
  inventoryId: string,
) {
  const response =
    await apiClient.delete<
      ApiResponse<null> | null
    >(`/inventory/${inventoryId}`);

  return response.data;
}

export async function adjustStock(
  inventoryId: string,
  data: StockAdjustmentData,
): Promise<InventoryItem> {
  const response =
    await apiClient.patch<
      InventoryItem |
      ApiResponse<InventoryItem>
    >(
      `/inventory/${inventoryId}/stock`,
      data,
    );

  return unwrap(response.data);
}