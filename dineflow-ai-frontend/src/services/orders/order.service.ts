import apiClient from "@/services/api/api-client";

import type {
  CreateOrderData,
  Order,
  UpdateOrderData,
  UpdateOrderStatusData,
} from "@/types/order.types";

export async function getOrders(
  restaurantId?: string,
) {
  const response =
    await apiClient.get<Order[]>(
      "/orders",
      {
        params: restaurantId
          ? { restaurantId }
          : undefined,
      },
    );

  return response.data;
}

export async function getOrderById(
  orderId: string,
) {
  const response =
    await apiClient.get<Order>(
      `/orders/${orderId}`,
    );

  return response.data;
}

export async function createOrder(
  data: CreateOrderData,
) {
  const response =
    await apiClient.post<Order>(
      "/orders",
      data,
    );

  return response.data;
}

export async function updateOrder(
  orderId: string,
  data: UpdateOrderData,
) {
  const response =
    await apiClient.patch<Order>(
      `/orders/${orderId}`,
      data,
    );

  return response.data;
}

export async function updateOrderStatus(
  orderId: string,
  data: UpdateOrderStatusData,
) {
  const response =
    await apiClient.patch<Order>(
      `/orders/${orderId}/status`,
      data,
    );

  return response.data;
}

export async function cancelOrder(
  orderId: string,
) {
  const response =
    await apiClient.patch<Order>(
      `/orders/${orderId}/cancel`,
    );

  return response.data;
}