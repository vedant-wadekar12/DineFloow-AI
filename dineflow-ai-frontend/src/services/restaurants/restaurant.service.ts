import apiClient from "@/services/api/api-client";

import type {
  CreateRestaurantData,
  Restaurant,
  RestaurantListResponse,
  RestaurantQueryParams,
  UpdateRestaurantData,
} from "@/types/restaurant.types";

/**
 * Restaurant API service.
 *
 * Keep all backend endpoint assumptions here.
 * If your backend uses different routes or response shapes,
 * this file is the only place that should need adjustment.
 */

export async function getRestaurants(
  params?: RestaurantQueryParams,
) {
  const response =
    await apiClient.get<RestaurantListResponse>(
      "/restaurants",
      {
        params,
      },
    );

  return response.data;
}

export async function getRestaurantById(
  id: string,
) {
  const response =
    await apiClient.get<Restaurant>(
      `/restaurants/${id}`,
    );

  return response.data;
}

export async function createRestaurant(
  data: CreateRestaurantData,
) {
  const response =
    await apiClient.post<Restaurant>(
      "/restaurants",
      data,
    );

  return response.data;
}

export async function updateRestaurant(
  id: string,
  data: UpdateRestaurantData,
) {
  const response =
    await apiClient.patch<Restaurant>(
      `/restaurants/${id}`,
      data,
    );

  return response.data;
}

export async function deleteRestaurant(
  id: string,
) {
  const response = await apiClient.delete(
    `/restaurants/${id}`,
  );

  return response.data;
}

export async function updateRestaurantStatus(
  id: string,
  status: Restaurant["status"],
) {
  const response =
    await apiClient.patch<Restaurant>(
      `/restaurants/${id}/status`,
      { status },
    );

  return response.data;
}