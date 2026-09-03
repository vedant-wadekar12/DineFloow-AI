export interface CreateRestaurantDto {
  name: string;
  slug: string;
  description?: string;
  phone: string;
  email: string;
  address: string;
}

export interface UpdateRestaurantDto {
  name?: string;
  slug?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
}