export interface CreateMenuAddonDto {
  restaurantId: string;
  branchId?: string;

  name: string;
  description?: string;

  price: number;
}

export interface UpdateMenuAddonDto {
  branchId?: string;

  name?: string;
  description?: string;

  price?: number;
}

export interface UpdateMenuAddonAvailabilityDto {
  isAvailable: boolean;
}