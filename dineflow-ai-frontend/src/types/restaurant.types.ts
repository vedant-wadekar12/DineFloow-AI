export type RestaurantStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED";

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;

  email?: string;
  phone?: string;

  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;

  logo?: string;
  coverImage?: string;

  status: RestaurantStatus;

  ownerId?: string;

  currency: string;
  timezone: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRestaurantData {
  name: string;
  slug: string;
  description?: string;

  email?: string;
  phone?: string;

  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;

  currency: string;
  timezone: string;
}

export interface UpdateRestaurantData
  extends Partial<CreateRestaurantData> {
  status?: RestaurantStatus;
}

export interface RestaurantListResponse {
  restaurants: Restaurant[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface RestaurantQueryParams {
  search?: string;
  status?: RestaurantStatus | "ALL";
  page?: number;
  limit?: number;
}