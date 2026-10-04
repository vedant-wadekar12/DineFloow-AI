import apiClient from "@/services/api/api-client";

import type {
  CreateCategoryData,
  CreateMenuAddonData,
  CreateMenuComboData,
  CreateMenuItemData,
  CreateMenuVariantData,
  MenuAddon,
  MenuCategory,
  MenuCombo,
  MenuItem,
  MenuVariant,
  UpdateCategoryData,
  UpdateMenuAddonData,
  UpdateMenuComboData,
  UpdateMenuItemData,
  UpdateMenuVariantData,
} from "@/types/menu.types";

import { MENU_API } from "./menu.api";

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

/* ---------------- CATEGORIES ---------------- */

export async function getCategories(
  restaurantId: string,
): Promise<MenuCategory[]> {
  const response = await apiClient.get<
    ApiResponse<MenuCategory[]>
  >(
    MENU_API.categoriesByRestaurant(
      restaurantId,
    ),
  );

  return unwrap(response.data);
}

export async function createCategory(
  data: CreateCategoryData,
): Promise<MenuCategory> {
  const response = await apiClient.post<
    ApiResponse<MenuCategory>
  >(
    MENU_API.categories,
    data,
  );

  return unwrap(response.data);
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryData,
): Promise<MenuCategory> {
  const response = await apiClient.patch<
    ApiResponse<MenuCategory>
  >(
    MENU_API.categoryById(id),
    data,
  );

  return unwrap(response.data);
}

export async function deleteCategory(
  id: string,
): Promise<void> {
  await apiClient.delete(
    MENU_API.categoryById(id),
  );
}

/* ---------------- MENU ITEMS ---------------- */

export async function getMenuItems(
  restaurantId: string,
): Promise<MenuItem[]> {
  const response = await apiClient.get<
    ApiResponse<MenuItem[]>
  >(
    MENU_API.itemsByRestaurant(
      restaurantId,
    ),
  );

  return unwrap(response.data);
}

export async function getMenuItemsByBranch(
  branchId: string,
): Promise<MenuItem[]> {
  const response = await apiClient.get<
    ApiResponse<MenuItem[]>
  >(
    MENU_API.itemsByBranch(branchId),
  );

  return unwrap(response.data);
}

export async function getMenuItemsByCategory(
  categoryId: string,
): Promise<MenuItem[]> {
  const response = await apiClient.get<
    ApiResponse<MenuItem[]>
  >(
    MENU_API.itemsByCategory(categoryId),
  );

  return unwrap(response.data);
}

export async function getMenuItem(
  id: string,
): Promise<MenuItem> {
  const response = await apiClient.get<
    ApiResponse<MenuItem>
  >(MENU_API.itemById(id));

  return unwrap(response.data);
}

export async function createMenuItem(
  data: CreateMenuItemData,
): Promise<MenuItem> {
  const response = await apiClient.post<
    ApiResponse<MenuItem>
  >(
    MENU_API.items,
    data,
  );

  return unwrap(response.data);
}

export async function updateMenuItem(
  id: string,
  data: UpdateMenuItemData,
): Promise<MenuItem> {
  const response = await apiClient.patch<
    ApiResponse<MenuItem>
  >(
    MENU_API.itemById(id),
    data,
  );

  return unwrap(response.data);
}

export async function updateMenuItemAvailability(
  id: string,
  isAvailable: boolean,
): Promise<MenuItem> {
  const response = await apiClient.patch<
    ApiResponse<MenuItem>
  >(
    MENU_API.itemAvailability(id),
    { isAvailable },
  );

  return unwrap(response.data);
}

export async function updateMenuItemStatus(
  id: string,
  isActive: boolean,
): Promise<MenuItem> {
  const response = await apiClient.patch<
    ApiResponse<MenuItem>
  >(
    MENU_API.itemStatus(id),
    { isActive },
  );

  return unwrap(response.data);
}

export async function deleteMenuItem(
  id: string,
): Promise<void> {
  await apiClient.delete(
    MENU_API.itemById(id),
  );
}

/* ---------------- VARIANTS ---------------- */

export async function getVariantsByMenuItem(
  menuItemId: string,
): Promise<MenuVariant[]> {
  const response = await apiClient.get<
    ApiResponse<MenuVariant[]>
  >(
    MENU_API.variantsByItem(menuItemId),
  );

  return unwrap(response.data);
}

export async function createVariant(
  data: CreateMenuVariantData,
): Promise<MenuVariant> {
  const response = await apiClient.post<
    ApiResponse<MenuVariant>
  >(
    MENU_API.variants,
    data,
  );

  return unwrap(response.data);
}

export async function updateVariant(
  id: string,
  data: UpdateMenuVariantData,
): Promise<MenuVariant> {
  const response = await apiClient.patch<
    ApiResponse<MenuVariant>
  >(
    MENU_API.variantById(id),
    data,
  );

  return unwrap(response.data);
}

export async function updateVariantAvailability(
  id: string,
  isAvailable: boolean,
): Promise<MenuVariant> {
  const response = await apiClient.patch<
    ApiResponse<MenuVariant>
  >(
    MENU_API.variantAvailability(id),
    { isAvailable },
  );

  return unwrap(response.data);
}

export async function deleteVariant(
  id: string,
): Promise<void> {
  await apiClient.delete(
    MENU_API.variantById(id),
  );
}

/* ---------------- ADDONS ---------------- */

export async function getAddons(
  restaurantId: string,
): Promise<MenuAddon[]> {
  const response = await apiClient.get<
    ApiResponse<MenuAddon[]>
  >(
    MENU_API.addonsByRestaurant(
      restaurantId,
    ),
  );

  return unwrap(response.data);
}

export async function createAddon(
  data: CreateMenuAddonData,
): Promise<MenuAddon> {
  const response = await apiClient.post<
    ApiResponse<MenuAddon>
  >(
    MENU_API.addons,
    data,
  );

  return unwrap(response.data);
}

export async function updateAddon(
  id: string,
  data: UpdateMenuAddonData,
): Promise<MenuAddon> {
  const response = await apiClient.patch<
    ApiResponse<MenuAddon>
  >(
    MENU_API.addonById(id),
    data,
  );

  return unwrap(response.data);
}

export async function updateAddonAvailability(
  id: string,
  isAvailable: boolean,
): Promise<MenuAddon> {
  const response = await apiClient.patch<
    ApiResponse<MenuAddon>
  >(
    MENU_API.addonAvailability(id),
    { isAvailable },
  );

  return unwrap(response.data);
}

export async function deleteAddon(
  id: string,
): Promise<void> {
  await apiClient.delete(
    MENU_API.addonById(id),
  );
}

/* ---------------- COMBOS ---------------- */

export async function getCombos(
  restaurantId: string,
): Promise<MenuCombo[]> {
  const response = await apiClient.get<
    ApiResponse<MenuCombo[]>
  >(
    MENU_API.combosByRestaurant(
      restaurantId,
    ),
  );

  return unwrap(response.data);
}

export async function createCombo(
  data: CreateMenuComboData,
): Promise<MenuCombo> {
  const response = await apiClient.post<
    ApiResponse<MenuCombo>
  >(
    MENU_API.combos,
    data,
  );

  return unwrap(response.data);
}

export async function updateCombo(
  id: string,
  data: UpdateMenuComboData,
): Promise<MenuCombo> {
  const response = await apiClient.patch<
    ApiResponse<MenuCombo>
  >(
    MENU_API.comboById(id),
    data,
  );

  return unwrap(response.data);
}

export async function updateComboAvailability(
  id: string,
  isAvailable: boolean,
): Promise<MenuCombo> {
  const response = await apiClient.patch<
    ApiResponse<MenuCombo>
  >(
    MENU_API.comboAvailability(id),
    { isAvailable },
  );

  return unwrap(response.data);
}

export async function deleteCombo(
  id: string,
): Promise<void> {
  await apiClient.delete(
    MENU_API.comboById(id),
  );
}