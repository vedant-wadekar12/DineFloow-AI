export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  image?: string;
  displayOrder?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;

  name: string;
  description?: string;

  price: number;

  image?: string;

  isVegetarian: boolean;
  isAvailable: boolean;
  isSpecial: boolean;
  isActive: boolean;

  preparationTime?: number;

  displayOrder?: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  image?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateMenuItemData {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  isSpecial: boolean;
  isActive: boolean;
  preparationTime?: number;
  displayOrder?: number;
}

export interface UpdateMenuItemData {
  categoryId?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  isVegetarian?: boolean;
  isAvailable?: boolean;
  isSpecial?: boolean;
  isActive?: boolean;
  preparationTime?: number;
  displayOrder?: number;
}

export interface MenuStats {
  totalCategories: number;
  activeCategories: number;
  totalItems: number;
  availableItems: number;
  unavailableItems: number;
  specialItems: number;
}