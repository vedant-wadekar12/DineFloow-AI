export interface CreateCategoryDto {
  restaurantId: string;
  branchId?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  sortOrder?: number;
}