import apiClient from "@/services/api/api-client";

import type {
  CreateInventoryData,
  CreateMenuRecipeData,
  InventoryItem,
  MenuRecipe,
  StockAdjustmentData,
  StockTransaction,
  UpdateInventoryData,
  UpdateMenuRecipeData,
} from "@/types/inventory.types";

import { INVENTORY_API } from "./inventory.api";

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

function unwrap<T>(response: ApiResponse<T> | T): T {
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    response.data !== undefined
  ) {
    return response.data;
  }

  return response as T;
}

export async function getInventoryByRestaurant(
  restaurantId: string,
): Promise<InventoryItem[]> {
  const response = await apiClient.get<
    ApiResponse<InventoryItem[]>
  >(INVENTORY_API.itemsByRestaurant(restaurantId));

  return unwrap(response.data);
}

export async function getInventoryByBranch(
  branchId: string,
): Promise<InventoryItem[]> {
  const response = await apiClient.get<
    ApiResponse<InventoryItem[]>
  >(INVENTORY_API.itemsByBranch(branchId));

  return unwrap(response.data);
}

export async function getLowStockInventory(
  restaurantId: string,
): Promise<InventoryItem[]> {
  const response = await apiClient.get<
    ApiResponse<InventoryItem[]>
  >(
    INVENTORY_API.itemsByRestaurantLowStock(
      restaurantId,
    ),
  );

  return unwrap(response.data);
}

export async function getInventoryById(
  inventoryItemId: string,
): Promise<InventoryItem> {
  const response = await apiClient.get<
    ApiResponse<InventoryItem>
  >(
    INVENTORY_API.itemById(inventoryItemId),
  );

  return unwrap(response.data);
}

export async function createInventory(
  data: CreateInventoryData,
): Promise<InventoryItem> {
  const response = await apiClient.post<
    ApiResponse<InventoryItem>
  >(
    INVENTORY_API.items,
    data,
  );

  return unwrap(response.data);
}

export async function updateInventory(
  inventoryItemId: string,
  data: UpdateInventoryData,
): Promise<InventoryItem> {
  const response = await apiClient.patch<
    ApiResponse<InventoryItem>
  >(
    INVENTORY_API.itemById(inventoryItemId),
    data,
  );

  return unwrap(response.data);
}

export async function deleteInventory(
  inventoryItemId: string,
): Promise<void> {
  await apiClient.delete(
    INVENTORY_API.itemById(inventoryItemId),
  );
}

export async function adjustStock(
  data: StockAdjustmentData,
): Promise<{
  inventoryItem: InventoryItem;
  transaction: StockTransaction;
}> {
  const response = await apiClient.post<
    ApiResponse<{
      inventoryItem: InventoryItem;
      transaction: StockTransaction;
    }>
  >(
    INVENTORY_API.stockAdjust,
    data,
  );

  return unwrap(response.data);
}

export async function getStockTransactions(
  inventoryItemId: string,
): Promise<StockTransaction[]> {
  const response = await apiClient.get<
    ApiResponse<StockTransaction[]>
  >(
    INVENTORY_API.stockByItem(
      inventoryItemId,
    ),
  );

  return unwrap(response.data);
}

export async function getRestaurantStockTransactions(
  restaurantId: string,
): Promise<StockTransaction[]> {
  const response = await apiClient.get<
    ApiResponse<StockTransaction[]>
  >(
    INVENTORY_API.stockByRestaurant(
      restaurantId,
    ),
  );

  return unwrap(response.data);
}

export async function getMenuRecipes(
  menuItemId: string,
): Promise<MenuRecipe[]> {
  const response = await apiClient.get<
    ApiResponse<MenuRecipe[]>
  >(
    INVENTORY_API.recipesByMenuItem(
      menuItemId,
    ),
  );

  return unwrap(response.data);
}

export async function createMenuRecipe(
  data: CreateMenuRecipeData,
): Promise<MenuRecipe> {
  const response = await apiClient.post<
    ApiResponse<MenuRecipe>
  >(
    INVENTORY_API.recipes,
    data,
  );

  return unwrap(response.data);
}

export async function updateMenuRecipe(
  recipeId: string,
  data: UpdateMenuRecipeData,
): Promise<MenuRecipe> {
  const response = await apiClient.patch<
    ApiResponse<MenuRecipe>
  >(
    INVENTORY_API.recipeById(recipeId),
    data,
  );

  return unwrap(response.data);
}

export async function deleteMenuRecipe(
  recipeId: string,
): Promise<void> {
  await apiClient.delete(
    INVENTORY_API.recipeById(recipeId),
  );
}