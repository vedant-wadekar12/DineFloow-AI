import apiClient from "@/services/api/api-client";

import type {
  CreateOrderData,
  Order,
  UpdateOrderData,
  UpdateOrderStatusData,
} from "@/types/order.types";

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

function unwrap<T>(responseData: T | ApiResponse<T>): T {
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    const data = (responseData as ApiResponse<T>).data;

    if (data !== undefined) {
      return data;
    }
  }

  return responseData as T;
}

export async function getOrders(
  restaurantId?: string,
): Promise<Order[]> {
  const response = await apiClient.get<
    Order[] | ApiResponse<Order[]> | { orders?: Order[] }
  >("/orders", {
    params: restaurantId
      ? { restaurantId }
      : undefined,
  });

  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray(data.data)
  ) {
    return data.data;
  }

  if (
    data &&
    typeof data === "object" &&
    "orders" in data &&
    Array.isArray(data.orders)
  ) {
    return data.orders;
  }

  return [];
}

export async function getOrderById(
  orderId: string,
): Promise<Order> {
  const response = await apiClient.get<
    Order | ApiResponse<Order>
  >(`/orders/${orderId}`);

  return unwrap(response.data);
}

export async function createOrder(
  data: CreateOrderData,
): Promise<Order> {
  const response = await apiClient.post<
    Order | ApiResponse<Order>
  >("/orders", data);

  return unwrap(response.data);
}

export async function updateOrder(
  orderId: string,
  data: UpdateOrderData,
): Promise<Order> {
  const response = await apiClient.patch<
    Order | ApiResponse<Order>
  >(`/orders/${orderId}`, data);

  return unwrap(response.data);
}

export async function updateOrderStatus(
  orderId: string,
  data: UpdateOrderStatusData,
): Promise<Order> {
  const response = await apiClient.patch<
    Order | ApiResponse<Order>
  >(`/orders/${orderId}/status`, data);

  return unwrap(response.data);
}

export async function cancelOrder(
  orderId: string,
): Promise<Order> {
  const response = await apiClient.patch<
    Order | ApiResponse<Order>
  >(`/orders/${orderId}/cancel`);

  return unwrap(response.data);
}