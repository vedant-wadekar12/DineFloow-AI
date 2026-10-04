export const INVENTORY_API = {
  items: "/inventory",
  itemsByRestaurant: (restaurantId: string) =>
    `/inventory/restaurant/${restaurantId}`,
  itemsByRestaurantLowStock: (restaurantId: string) =>
    `/inventory/restaurant/${restaurantId}/low-stock`,
  itemsByBranch: (branchId: string) =>
    `/inventory/branch/${branchId}`,
  itemById: (inventoryItemId: string) =>
    `/inventory/${inventoryItemId}`,

  stockAdjust: "/stock/adjust",
  stockByItem: (inventoryItemId: string) =>
    `/stock/item/${inventoryItemId}`,
  stockByRestaurant: (restaurantId: string) =>
    `/stock/restaurant/${restaurantId}`,

  recipes: "/menu-recipes",
  recipesByMenuItem: (menuItemId: string) =>
    `/menu-recipes/menu-item/${menuItemId}`,
  recipeById: (recipeId: string) =>
    `/menu-recipes/${recipeId}`,
} as const;