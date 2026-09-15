export interface ComboItemDto {
  menuItemId: string;
  quantity: number;
}

export interface CreateMenuComboDto {
  restaurantId: string;
  branchId?: string;

  name: string;
  slug: string;
  description?: string;
  image?: string;

  price: number;
  discountPrice?: number;

  sortOrder?: number;

  items: ComboItemDto[];
}

export interface UpdateMenuComboDto {
  branchId?: string;

  name?: string;
  slug?: string;
  description?: string;
  image?: string;

  price?: number;
  discountPrice?: number;

  sortOrder?: number;

  items?: ComboItemDto[];
}

export interface UpdateMenuComboAvailabilityDto {
  isAvailable: boolean;
}