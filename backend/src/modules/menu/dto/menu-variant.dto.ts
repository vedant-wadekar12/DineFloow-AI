export interface CreateMenuVariantDto {
  menuItemId: string;
  restaurantId: string;
  branchId?: string;

  name: string;
  description?: string;

  price: number;
  discountPrice?: number;

  sortOrder?: number;
}

export interface UpdateMenuVariantDto {
  branchId?: string;

  name?: string;
  description?: string;

  price?: number;
  discountPrice?: number;

  sortOrder?: number;
}

export interface UpdateMenuVariantAvailabilityDto {
  isAvailable: boolean;
}