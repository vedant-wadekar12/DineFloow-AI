import apiClient from "@/services/api/api-client";

import type {
  CreateStaffData,
  StaffMember,
  UpdateStaffData,
} from "@/types/staff.types";

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

function unwrap<T>(
  value: T | ApiResponse<T>,
): T {
  if (
    value &&
    typeof value === "object" &&
    "data" in value
  ) {
    const data =
      (value as ApiResponse<T>).data;

    if (data !== undefined) {
      return data;
    }
  }

  return value as T;
}

export async function getStaff(
  restaurantId?: string,
): Promise<StaffMember[]> {
  const response =
    await apiClient.get<
      StaffMember[] |
      ApiResponse<StaffMember[]> |
      { staff?: StaffMember[] }
    >("/staff", {
      params: restaurantId
        ? { restaurantId }
        : undefined,
    });

  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (
    "data" in data &&
    Array.isArray(data.data)
  ) {
    return data.data;
  }

  if (
    "staff" in data &&
    Array.isArray(data.staff)
  ) {
    return data.staff;
  }

  return [];
}

export async function getStaffById(
  staffId: string,
): Promise<StaffMember> {
  const response =
    await apiClient.get<
      StaffMember |
      ApiResponse<StaffMember>
    >(`/staff/${staffId}`);

  return unwrap(response.data);
}

export async function createStaff(
  data: CreateStaffData,
): Promise<StaffMember> {
  const response =
    await apiClient.post<
      StaffMember |
      ApiResponse<StaffMember>
    >("/staff", data);

  return unwrap(response.data);
}

export async function updateStaff(
  staffId: string,
  data: UpdateStaffData,
): Promise<StaffMember> {
  const response =
    await apiClient.patch<
      StaffMember |
      ApiResponse<StaffMember>
    >(`/staff/${staffId}`, data);

  return unwrap(response.data);
}

export async function deleteStaff(
  staffId: string,
) {
  const response =
    await apiClient.delete<
      ApiResponse<null> | null
    >(`/staff/${staffId}`);

  return response.data;
}

export async function updateStaffStatus(
  staffId: string,
  isActive: boolean,
): Promise<StaffMember> {
  const response =
    await apiClient.patch<
      StaffMember |
      ApiResponse<StaffMember>
    >(
      `/staff/${staffId}/status`,
      {
        isActive,
      },
    );

  return unwrap(response.data);
}