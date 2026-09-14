import apiClient from "@/services/api/api-client";

import type {
  CreateInventoryData,
  InventoryItem,
  StockAdjustmentData,
  UpdateInventoryData,
} from "@/types/inventory.types";

export async function getInventory(
  restaurantId?: string,
) {
  const response = await apiClient.get<InventoryItem[]>(
    "/inventory",
    {
      params: restaurantId
        ? { restaurantId }
        : undefined,
    },
  );

  return response.data;
}

export async function getInventoryById(
  inventoryId: string,
) {
  const response =
    await apiClient.get<InventoryItem>(
      `/inventory/${inventoryId}`,
    );

  return response.data;
}

export async function createInventory(
  data: CreateInventoryData,
) {
  const response =
    await apiClient.post<InventoryItem>(
      "/inventory",
      data,
    );

  return response.data;
}

export async function updateInventory(
  inventoryId: string,
  data: UpdateInventoryData,
) {
  const response =
    await apiClient.patch<InventoryItem>(
      `/inventory/${inventoryId}`,
      data,
    );

  return response.data;
}

export async function deleteInventory(
  inventoryId: string,
) {
  const response = await apiClient.delete(
    `/inventory/${inventoryId}`,
  );

  return response.data;
}

export async function adjustStock(
  inventoryId: string,
  data: StockAdjustmentData,
) {
  const response =
    await apiClient.patch<InventoryItem>(
      `/inventory/${inventoryId}/stock`,
      data,
    );

  return response.data;
}