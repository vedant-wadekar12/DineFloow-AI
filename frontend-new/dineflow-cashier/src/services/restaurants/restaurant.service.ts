import apiClient from "@/services/api/api-client";

import type {
  CreateRestaurantData,
  Restaurant,
  RestaurantListResponse,
  RestaurantQueryParams,
  UpdateRestaurantData,
} from "@/types/restaurant.types";

/**
 * Backend restaurant object may contain MongoDB `_id`
 * instead of frontend-friendly `id`.
 */
type BackendRestaurant = Partial<Restaurant> & {
  _id?: string;
};

function normalizeRestaurant(
  restaurant: BackendRestaurant,
): Restaurant {
  return {
    id:
      restaurant.id ??
      restaurant._id ??
      "",

    name:
      restaurant.name ??
      "",

    slug:
      restaurant.slug ??
      "",

    description:
      restaurant.description,

    email:
      restaurant.email,

    phone:
      restaurant.phone,

    address:
      restaurant.address,

    city:
      restaurant.city,

    state:
      restaurant.state,

    country:
      restaurant.country,

    postalCode:
      restaurant.postalCode,

    logo:
      restaurant.logo,

    coverImage:
      restaurant.coverImage,

    status:
      restaurant.status ??
      "ACTIVE",

    ownerId:
      restaurant.ownerId,

    currency:
      restaurant.currency ??
      "INR",

    timezone:
      restaurant.timezone ??
      "Asia/Kolkata",

    createdAt:
      restaurant.createdAt,

    updatedAt:
      restaurant.updatedAt,
  };
}

function extractRestaurant(
  response: unknown,
): Restaurant {
  const data = response as any;

  const restaurant =
    data?.restaurant ??
    data?.data?.restaurant ??
    data?.data ??
    data;

  return normalizeRestaurant(
    restaurant,
  );
}

/* ==========================================
   GET ALL RESTAURANTS
========================================== */

export async function getRestaurants(
  params?: RestaurantQueryParams,
): Promise<RestaurantListResponse> {
  const response =
    await apiClient.get<any>(
      "/restaurants",
      {
        params,
      },
    );

  const data = response.data;

  const rawRestaurants =
    Array.isArray(data)
      ? data
      : Array.isArray(data?.restaurants)
        ? data.restaurants
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.data?.restaurants)
            ? data.data.restaurants
            : [];

  const restaurants =
    rawRestaurants.map(
      (restaurant: BackendRestaurant) =>
        normalizeRestaurant(
          restaurant,
        ),
    );

  return {
    restaurants,

    total:
      data?.total ??
      data?.data?.total ??
      restaurants.length,

    page:
      data?.page ??
      data?.data?.page,

    limit:
      data?.limit ??
      data?.data?.limit,

    totalPages:
      data?.totalPages ??
      data?.data?.totalPages,
  };
}

/* ==========================================
   GET RESTAURANT BY ID
========================================== */

export async function getRestaurantById(
  id: string,
): Promise<Restaurant> {
  if (!id || id === "undefined") {
    throw new Error(
      "Restaurant ID is missing.",
    );
  }

  const response =
    await apiClient.get<any>(
      `/restaurants/${id}`,
    );

  return extractRestaurant(
    response.data,
  );
}

/* ==========================================
   CREATE RESTAURANT
========================================== */

export async function createRestaurant(
  data: CreateRestaurantData,
): Promise<Restaurant> {
  const response =
    await apiClient.post<any>(
      "/restaurants",
      data,
    );

  return extractRestaurant(
    response.data,
  );
}

/* ==========================================
   UPDATE RESTAURANT
========================================== */

export async function updateRestaurant(
  id: string,
  data: UpdateRestaurantData,
): Promise<Restaurant> {
  if (!id || id === "undefined") {
    throw new Error(
      "Restaurant ID is missing.",
    );
  }

  const response =
    await apiClient.patch<any>(
      `/restaurants/${id}`,
      data,
    );

  return extractRestaurant(
    response.data,
  );
}

/* ==========================================
   DELETE RESTAURANT
========================================== */

export async function deleteRestaurant(
  id: string,
) {
  if (!id || id === "undefined") {
    throw new Error(
      "Restaurant ID is missing.",
    );
  }

  const response =
    await apiClient.delete(
      `/restaurants/${id}`,
    );

  return response.data;
}

/* ==========================================
   UPDATE RESTAURANT STATUS
========================================== */

export async function updateRestaurantStatus(
  id: string,
  status: Restaurant["status"],
): Promise<Restaurant> {
  if (!id || id === "undefined") {
    throw new Error(
      "Restaurant ID is missing.",
    );
  }

  const response =
    await apiClient.patch<any>(
      `/restaurants/${id}/status`,
      { status },
    );

  return extractRestaurant(
    response.data,
  );
}