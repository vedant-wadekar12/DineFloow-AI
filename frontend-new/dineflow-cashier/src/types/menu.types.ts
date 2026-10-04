export type MenuItemType =
  | "FOOD"
  | "BEVERAGE"
  | "DESSERT"
  | "OTHER";

export interface MenuCategory {
  id: string;
  restaurantId: string;
  branchId?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  branchId?: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  type: MenuItemType;
  price: number;
  discountPrice?: number;
  image?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  preparationTime?: number;
  sortOrder?: number;
  isAvailable: boolean;
  isSpecial: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryData {
  restaurantId: string;
  branchId?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder?: number;
}

export interface UpdateCategoryData {
  branchId?: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  sortOrder?: number;
}

export interface CreateMenuItemData {
  restaurantId: string;
  branchId?: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  type: MenuItemType;
  price: number;
  discountPrice?: number;
  image?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  preparationTime?: number;
  sortOrder?: number;
}

export interface UpdateMenuItemData {
  categoryId?: string;
  name?: string;
  slug?: string;
  description?: string;
  type?: MenuItemType;
  price?: number;
  discountPrice?: number;
  image?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  preparationTime?: number;
  sortOrder?: number;
}

export interface MenuVariant {
  id: string;
  menuItemId: string;
  restaurantId: string;
  branchId?: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  sortOrder?: number;
  isAvailable: boolean;
}

export interface CreateMenuVariantData {
  menuItemId: string;
  restaurantId: string;
  branchId?: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  sortOrder?: number;
}

export interface UpdateMenuVariantData {
  branchId?: string;
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  sortOrder?: number;
}

export interface MenuAddon {
  id: string;
  restaurantId: string;
  branchId?: string;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
}

export interface CreateMenuAddonData {
  restaurantId: string;
  branchId?: string;
  name: string;
  description?: string;
  price: number;
}

export interface UpdateMenuAddonData {
  branchId?: string;
  name?: string;
  description?: string;
  price?: number;
}

export interface MenuComboItem {
  menuItemId: string;
  quantity: number;
}

export interface MenuCombo {
  id: string;
  restaurantId: string;
  branchId?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  price: number;
  discountPrice?: number;
  sortOrder?: number;
  isAvailable: boolean;
  items: MenuComboItem[];
}

export interface CreateMenuComboData {
  restaurantId: string;
  branchId?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  price: number;
  discountPrice?: number;
  sortOrder?: number;
  items: MenuComboItem[];
}

export interface UpdateMenuComboData {
  branchId?: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  price?: number;
  discountPrice?: number;
  sortOrder?: number;
  items?: MenuComboItem[];
}

export interface MenuStats {
  totalCategories: number;
  activeCategories: number;
  totalItems: number;
  availableItems: number;
  unavailableItems: number;
  specialItems: number;
  totalVariants: number;
  totalAddons: number;
  totalCombos: number;
}