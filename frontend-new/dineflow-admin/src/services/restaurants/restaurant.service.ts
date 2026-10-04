import apiClient from "@/services/api/api-client";

import type {
  CreateRestaurantData,
  Restaurant,
  RestaurantListResponse,
  RestaurantQueryParams,
  UpdateRestaurantData,
} from "@/types/restaurant.types";

/**
 * Backend restaurant object.
 *
 * The backend may return MongoDB `_id`
 * instead of frontend-friendly `id`.
 *
 * The backend status endpoint uses:
 *
 * {
 *   isActive: boolean
 * }
 */
type BackendRestaurant = Partial<Restaurant> & {
  _id?: string;
  isActive?: boolean;
};

/**
 * Normalize backend restaurant data into
 * the frontend Restaurant type.
 */

function normalizeRestaurant(
  restaurant: BackendRestaurant,
): Restaurant {
  return {
    id: restaurant.id ?? restaurant._id ?? "",
    name: restaurant.name ?? "",
    slug: restaurant.slug ?? "",
    description: restaurant.description,
    email: restaurant.email,
    phone: restaurant.phone,
    address: restaurant.address,
    city: restaurant.city,
    state: restaurant.state,
    country: restaurant.country,
    postalCode: restaurant.postalCode,
    logo: restaurant.logo,
    coverImage: restaurant.coverImage,

    // The backend's isActive field is authoritative
    // when it is provided.
    status:
      restaurant.isActive === false
        ? "INACTIVE"
        : restaurant.status ?? "ACTIVE",

    ownerId: restaurant.ownerId,
    currency: restaurant.currency ?? "INR",
    timezone: restaurant.timezone ?? "Asia/Kolkata",
    createdAt: restaurant.createdAt,
    updatedAt: restaurant.updatedAt,
  };
}


/**
 * Extract a restaurant from different backend
 * response envelope formats.
 *
 * Supports:
 *
 * {
 *   restaurant: {...}
 * }
 *
 * {
 *   data: {
 *     restaurant: {...}
 *   }
 * }
 *
 * {
 *   data: {...}
 * }
 */
function extractRestaurant(
  response: unknown,
): Restaurant {
  if (
    !response ||
    typeof response !== "object"
  ) {
    throw new Error(
      "Invalid restaurant response from backend.",
    );
  }

  const data =
    response as Record<string, unknown>;

  const nestedData =
    data.data &&
    typeof data.data === "object"
      ? data.data as Record<string, unknown>
      : undefined;

  const restaurant =
    data.restaurant &&
    typeof data.restaurant === "object"
      ? data.restaurant
      : nestedData?.restaurant &&
          typeof nestedData.restaurant === "object"
        ? nestedData.restaurant
        : nestedData ?? data;

  return normalizeRestaurant(
    restaurant as BackendRestaurant,
  );
}

/* ==========================================
   GET ALL RESTAURANTS
========================================== */

export async function getRestaurants(
  params?: RestaurantQueryParams,
): Promise<RestaurantListResponse> {
  const response =
    await apiClient.get<unknown>(
      "/restaurants",
      {
        params,
      },
    );

  const data =
    response.data;

  if (
    !data ||
    typeof data !== "object"
  ) {
    return {
      restaurants: [],
      total: 0,
    };
  }

  const payload =
    data as Record<string, unknown>;

  const nestedData =
    payload.data &&
    typeof payload.data === "object"
      ? payload.data as Record<string, unknown>
      : undefined;

  let rawRestaurants: unknown[] = [];

  /*
   * Possible backend response:
   *
   * [
   *   {...},
   *   {...}
   * ]
   */
  if (Array.isArray(data)) {
    rawRestaurants = data;
  }

  /*
   * Possible:
   *
   * {
   *   restaurants: [...]
   * }
   */
  else if (
    Array.isArray(
      payload.restaurants,
    )
  ) {
    rawRestaurants =
      payload.restaurants;
  }

  /*
   * Possible:
   *
   * {
   *   data: [...]
   * }
   */
  else if (
    Array.isArray(
      payload.data,
    )
  ) {
    rawRestaurants =
      payload.data;
  }

  /*
   * Possible:
   *
   * {
   *   data: {
   *     restaurants: [...]
   *   }
   * }
   */
  else if (
    nestedData &&
    Array.isArray(
      nestedData.restaurants,
    )
  ) {
    rawRestaurants =
      nestedData.restaurants;
  }

  const restaurants =
    rawRestaurants
      .filter(
        (
          restaurant,
        ): restaurant is BackendRestaurant =>
          Boolean(
            restaurant &&
              typeof restaurant === "object",
          ),
      )
      .map(
        (restaurant) =>
          normalizeRestaurant(
            restaurant,
          ),
      );

  return {
    restaurants,

    total:
      typeof payload.total === "number"
        ? payload.total
        : typeof nestedData?.total === "number"
          ? nestedData.total
          : restaurants.length,

    page:
      typeof payload.page === "number"
        ? payload.page
        : typeof nestedData?.page === "number"
          ? nestedData.page
          : undefined,

    limit:
      typeof payload.limit === "number"
        ? payload.limit
        : typeof nestedData?.limit === "number"
          ? nestedData.limit
          : undefined,

    totalPages:
      typeof payload.totalPages === "number"
        ? payload.totalPages
        : typeof nestedData?.totalPages === "number"
          ? nestedData.totalPages
          : undefined,
  };
}

/* ==========================================
   GET RESTAURANT BY ID
========================================== */

export async function getRestaurantById(
  id: string,
): Promise<Restaurant> {
  if (
    !id ||
    id === "undefined"
  ) {
    throw new Error(
      "Restaurant ID is missing.",
    );
  }

  const response =
    await apiClient.get<unknown>(
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
    await apiClient.post<unknown>(
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
  if (
    !id ||
    id === "undefined"
  ) {
    throw new Error(
      "Restaurant ID is missing.",
    );
  }

  const response =
    await apiClient.patch<unknown>(
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
): Promise<unknown> {
  if (
    !id ||
    id === "undefined"
  ) {
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

/**
 * Activate / deactivate a restaurant.
 *
 * IMPORTANT:
 *
 * Backend endpoint:
 *
 * PATCH /api/v1/restaurants/:id/status
 *
 * Backend expects:
 *
 * {
 *   isActive: boolean
 * }
 *
 * NOT:
 *
 * {
 *   status: "ACTIVE"
 * }
 *
 * Therefore this function accepts a boolean.
 */
export async function updateRestaurantStatus(
  id: string,
  isActive: boolean,
): Promise<Restaurant> {
  if (
    !id ||
    id === "undefined"
  ) {
    throw new Error(
      "Restaurant ID is missing.",
    );
  }

  if (
    typeof isActive !== "boolean"
  ) {
    throw new Error(
      "Restaurant active status must be a boolean.",
    );
  }

  const response =
    await apiClient.patch<unknown>(
      `/restaurants/${id}/status`,
      {
        isActive,
      },
    );

  return extractRestaurant(
    response.data,
  );
} 