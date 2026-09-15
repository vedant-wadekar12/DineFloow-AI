import apiClient from "@/services/api/api-client";

import type {
  CreateCategoryData,
  CreateMenuItemData,
  MenuCategory,
  MenuItem,
  UpdateCategoryData,
  UpdateMenuItemData,
} from "@/types/menu.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/*
 * CATEGORY API
 */

export async function getCategories(
  restaurantId?: string,
) {
  const response =
    await apiClient.get<ApiResponse<MenuCategory[]>>(
      "/menu/categories",
      {
        params: restaurantId
          ? { restaurantId }
          : undefined,
      },
    );

  return response.data.data;
}

export async function getCategoryById(
  categoryId: string,
) {
  const response =
    await apiClient.get<ApiResponse<MenuCategory>>(
      `/menu/categories/${categoryId}`,
    );

  return response.data.data;
}

export async function createCategory(
  data: CreateCategoryData,
) {
  const response =
    await apiClient.post<ApiResponse<MenuCategory>>(
      "/menu/categories",
      data,
    );

  return response.data.data;
}

export async function updateCategory(
  categoryId: string,
  data: UpdateCategoryData,
) {
  const response =
    await apiClient.patch<ApiResponse<MenuCategory>>(
      `/menu/categories/${categoryId}`,
      data,
    );

  return response.data.data;
}

export async function deleteCategory(
  categoryId: string,
) {
  const response =
    await apiClient.delete<ApiResponse<null>>(
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
  const response =
    await apiClient.get<ApiResponse<MenuItem[]>>(
      "/menu/items",
      {
        params: restaurantId
          ? { restaurantId }
          : undefined,
      },
    );

  return response.data.data;
}

export async function getMenuItemById(
  itemId: string,
) {
  const response =
    await apiClient.get<ApiResponse<MenuItem>>(
      `/menu/items/${itemId}`,
    );

  return response.data.data;
}

export async function createMenuItem(
  data: CreateMenuItemData,
) {
  const response =
    await apiClient.post<ApiResponse<MenuItem>>(
      "/menu/items",
      data,
    );

  return response.data.data;
}

export async function updateMenuItem(
  itemId: string,
  data: UpdateMenuItemData,
) {
  const response =
    await apiClient.patch<ApiResponse<MenuItem>>(
      `/menu/items/${itemId}`,
      data,
    );

  return response.data.data;
}

export async function deleteMenuItem(
  itemId: string,
) {
  const response =
    await apiClient.delete<ApiResponse<null>>(
      `/menu/items/${itemId}`,
    );

  return response.data;
}