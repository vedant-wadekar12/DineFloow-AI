import apiClient from "@/services/api/api-client";

import type {
  CreateStaffData,
  StaffMember,
  UpdateStaffData,
} from "@/types/staff.types";

export async function getStaff(
  restaurantId?: string,
) {
  const response =
    await apiClient.get<StaffMember[]>(
      "/staff",
      {
        params: restaurantId
          ? { restaurantId }
          : undefined,
      },
    );

  return response.data;
}

export async function getStaffById(
  staffId: string,
) {
  const response =
    await apiClient.get<StaffMember>(
      `/staff/${staffId}`,
    );

  return response.data;
}

export async function createStaff(
  data: CreateStaffData,
) {
  const response =
    await apiClient.post<StaffMember>(
      "/staff",
      data,
    );

  return response.data;
}

export async function updateStaff(
  staffId: string,
  data: UpdateStaffData,
) {
  const response =
    await apiClient.patch<StaffMember>(
      `/staff/${staffId}`,
      data,
    );

  return response.data;
}

export async function deleteStaff(
  staffId: string,
) {
  const response =
    await apiClient.delete(
      `/staff/${staffId}`,
    );

  return response.data;
}

export async function updateStaffStatus(
  staffId: string,
  isActive: boolean,
) {
  const response =
    await apiClient.patch<StaffMember>(
      `/staff/${staffId}/status`,
      {
        isActive,
      },
    );

  return response.data;
}