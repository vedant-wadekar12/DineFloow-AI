import apiClient from "@/services/api/api-client";

export type BillingCycle = "MONTHLY" | "YEARLY";

export type SubscriptionStatus =
  | "TRIAL"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "EXPIRED";

export interface SubscriptionPlan {
  _id: string;
  name: string;
  code: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency?: string;
  features: string[];
  limits?: {
    branches?: number;
    tables?: number;
    employees?: number;
    menuItems?: number;
    ordersPerMonth?: number;
  };
  isActive: boolean;
}

export interface RestaurantSubscription {
  _id: string;
  restaurantId: string;
  planId: string | SubscriptionPlan;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  cancelledAt?: string;
  cancelAtPeriodEnd: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response =
    await apiClient.get<ApiResponse<SubscriptionPlan[]>>(
      "/subscriptions/plans",
    );

  if (!Array.isArray(response.data.data)) {
    throw new Error("Unexpected subscription plans response.");
  }

  return response.data.data;
}

export async function getRestaurantSubscription(
  restaurantId: string,
): Promise<RestaurantSubscription> {
  const id = restaurantId.trim();

  if (!id) {
    throw new Error("Enter a restaurant ID.");
  }

  const response =
    await apiClient.get<ApiResponse<RestaurantSubscription>>(
      `/subscriptions/restaurant/${encodeURIComponent(id)}`,
    );

  if (!response.data.data) {
    throw new Error("No subscription data was returned.");
  }

  return response.data.data;
}

export async function checkRestaurantSubscriptionStatus(
  restaurantId: string,
): Promise<RestaurantSubscription> {
  const id = restaurantId.trim();

  if (!id) {
    throw new Error("Enter a restaurant ID.");
  }

  const response =
    await apiClient.get<ApiResponse<RestaurantSubscription>>(
      `/subscriptions/restaurant/${encodeURIComponent(id)}/status`,
    );

  if (!response.data.data) {
    throw new Error("No subscription status was returned.");
  }

  return response.data.data;
}
