import apiClient from "@/services/api/api-client";

import type {
  CreateCustomerData,
  Customer,
  CustomerApiResponse,
  CustomerDeleteResponse,
  UpdateCustomerData,
  UpdateCustomerStatusData,
} from "@/types/customer.types";

const CUSTOMER_BASE_URL = "/customers";

export const customerService = {
  async create(
    data: CreateCustomerData,
  ): Promise<Customer> {
    const response =
      await apiClient.post<
        CustomerApiResponse<Customer>
      >(
        CUSTOMER_BASE_URL,
        data,
      );

    return response.data.data;
  },

  async getAll(): Promise<Customer[]> {
    const response =
      await apiClient.get<
        CustomerApiResponse<Customer[]>
      >(
        CUSTOMER_BASE_URL,
      );

    return response.data.data;
  },

  async getByRestaurant(
    restaurantId: string,
  ): Promise<Customer[]> {
    const response =
      await apiClient.get<
        CustomerApiResponse<Customer[]>
      >(
        `${CUSTOMER_BASE_URL}/restaurant/${restaurantId}`,
      );

    return response.data.data;
  },

  async getByPhone(
    restaurantId: string,
    phone: string,
  ): Promise<Customer> {
    const response =
      await apiClient.get<
        CustomerApiResponse<Customer>
      >(
        `${CUSTOMER_BASE_URL}/restaurant/${restaurantId}/phone/${encodeURIComponent(phone)}`,
      );

    return response.data.data;
  },

  async getById(
    customerId: string,
  ): Promise<Customer> {
    const response =
      await apiClient.get<
        CustomerApiResponse<Customer>
      >(
        `${CUSTOMER_BASE_URL}/${customerId}`,
      );

    return response.data.data;
  },

  async update(
    customerId: string,
    data: UpdateCustomerData,
  ): Promise<Customer> {
    const response =
      await apiClient.patch<
        CustomerApiResponse<Customer>
      >(
        `${CUSTOMER_BASE_URL}/${customerId}`,
        data,
      );

    return response.data.data;
  },

  async updateStatus(
    customerId: string,
    data: UpdateCustomerStatusData,
  ): Promise<Customer> {
    const response =
      await apiClient.patch<
        CustomerApiResponse<Customer>
      >(
        `${CUSTOMER_BASE_URL}/${customerId}/status`,
        data,
      );

    return response.data.data;
  },

  async delete(
    customerId: string,
  ): Promise<CustomerDeleteResponse> {
    const response =
      await apiClient.delete<
        CustomerDeleteResponse
      >(
        `${CUSTOMER_BASE_URL}/${customerId}`,
      );

    return response.data;
  },
};

export default customerService;