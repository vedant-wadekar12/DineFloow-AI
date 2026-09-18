import apiClient from "@/services/api/api-client";

export interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

function unwrapUsers(
  responseData:
    | User[]
    | ApiResponse<User[]>,
): User[] {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData &&
    Array.isArray(responseData.data)
  ) {
    return responseData.data;
  }

  return [];
}

export async function getUsers(): Promise<User[]> {
  const response =
    await apiClient.get<
      User[] | ApiResponse<User[]>
    >("/users");

  return unwrapUsers(response.data);
}