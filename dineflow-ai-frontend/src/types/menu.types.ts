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
  type: "FOOD" | "BEVERAGE" | "DESSERT" | "OTHER";
  price: number;
  discountPrice?: number;
  image?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
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
  type: "FOOD" | "BEVERAGE" | "DESSERT" | "OTHER";
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
  type?: "FOOD" | "BEVERAGE" | "DESSERT" | "OTHER";
  price?: number;
  discountPrice?: number;
  image?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  preparationTime?: number;
  sortOrder?: number;
}

export interface MenuStats {
  totalCategories: number;
  activeCategories: number;
  totalItems: number;
  availableItems: number;
  unavailableItems: number;
  specialItems: number;
}