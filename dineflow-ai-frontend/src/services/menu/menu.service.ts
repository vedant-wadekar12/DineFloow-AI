import apiClient from "@/services/api/api-client";

import type {
  CreateCategoryData,
  CreateMenuItemData,
  MenuCategory,
  MenuItem,
  UpdateCategoryData,
  UpdateMenuItemData,
} from "@/types/menu.types";

/*
 * CATEGORY API
 */

export async function getCategories(
  restaurantId?: string,
) {
  const response = await apiClient.get<MenuCategory[]>(
    "/menu/categories",
    {
      params: restaurantId ? { restaurantId } : undefined,
    },
  );

  return response.data;
}

export async function getCategoryById(
  categoryId: string,
) {
  const response = await apiClient.get<MenuCategory>(
    `/menu/categories/${categoryId}`,
  );

  return response.data;
}

export async function createCategory(
  data: CreateCategoryData,
) {
  const response = await apiClient.post<MenuCategory>(
    "/menu/categories",
    data,
  );

  return response.data;
}

export async function updateCategory(
  categoryId: string,
  data: UpdateCategoryData,
) {
  const response = await apiClient.patch<MenuCategory>(
    `/menu/categories/${categoryId}`,
    data,
  );

  return response.data;
}

export async function deleteCategory(
  categoryId: string,
) {
  const response = await apiClient.delete(
    `/menu/categories/${categoryId}`,
  );

  return response.data;
}


/*
 * MENU ITEM API
 */

export async function getMenuItems(
  restaurantId?: string,
) {
  const response = await apiClient.get<MenuItem[]>(
    "/menu/items",
    {
      params: restaurantId ? { restaurantId } : undefined,
    },
  );

  return response.data;
}

export async function getMenuItemById(
  itemId: string,
) {
  const response = await apiClient.get<MenuItem>(
    `/menu/items/${itemId}`,
  );

  return response.data;
}

export async function createMenuItem(
  data: CreateMenuItemData,
) {
  const response = await apiClient.post<MenuItem>(
    "/menu/items",
    data,
  );

  return response.data;
}

export async function updateMenuItem(
  itemId: string,
  data: UpdateMenuItemData,
) {
  const response = await apiClient.patch<MenuItem>(
    `/menu/items/${itemId}`,
    data,
  );

  return response.data;
}

export async function deleteMenuItem(
  itemId: string,
) {
  const response = await apiClient.delete(
    `/menu/items/${itemId}`,
  );

  return response.data;
}