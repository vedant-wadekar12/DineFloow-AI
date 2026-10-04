export const MENU_API = {
    categories: "/menu-categories",
categoryById: (id: string) =>
  `/menu-categories/${id}`,
categoriesByRestaurant: (restaurantId: string) =>
  `/menu-categories/restaurant/${restaurantId}`,
categoriesByBranch: (branchId: string) =>
  `/menu-categories/branch/${branchId}`,

  items: "/menu-items",
  itemById: (id: string) =>
    `/menu-items/${id}`,
  itemsByRestaurant: (restaurantId: string) =>
    `/menu-items/restaurant/${restaurantId}`,
  itemsByBranch: (branchId: string) =>
    `/menu-items/branch/${branchId}`,
  itemsByCategory: (categoryId: string) =>
    `/menu-items/category/${categoryId}`,
  itemAvailability: (id: string) =>
    `/menu-items/${id}/availability`,
  itemStatus: (id: string) =>
    `/menu-items/${id}/status`,

  variants: "/menu-variants",
  variantsByItem: (menuItemId: string) =>
    `/menu-variants/menu-item/${menuItemId}`,
  variantById: (id: string) =>
    `/menu-variants/${id}`,
  variantAvailability: (id: string) =>
    `/menu-variants/${id}/availability`,

  addons: "/menu-addons",
  addonsByRestaurant: (restaurantId: string) =>
    `/menu-addons/restaurant/${restaurantId}`,
  addonById: (id: string) =>
    `/menu-addons/${id}`,
  addonAvailability: (id: string) =>
    `/menu-addons/${id}/availability`,

  combos: "/menu-combos",
  combosByRestaurant: (restaurantId: string) =>
    `/menu-combos/restaurant/${restaurantId}`,
  comboById: (id: string) =>
    `/menu-combos/${id}`,
  comboAvailability: (id: string) =>
    `/menu-combos/${id}/availability`,
} as const;