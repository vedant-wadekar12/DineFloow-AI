import apiClient from "@/services/api/api-client";

import type {
  Branch,
  CreateBranchData,
  UpdateBranchData,
} from "@/types/branch.types";

export interface BranchListResponse {
  branches: Branch[];
  total?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
function normalizeBranch(branch: any): Branch {
  return {
    ...branch,
    id: branch.id ?? branch._id,
    restaurantId: branch.restaurantId,
    status:
      branch.status ??
      (branch.isActive ? "ACTIVE" : "INACTIVE"),
  };
}
export async function getBranches(
  restaurantId?: string,
): Promise<Branch[]> {
  const response = await apiClient.get<
    ApiResponse<Branch[]> | ApiResponse<BranchListResponse> | Branch[] | BranchListResponse
  >("/branches", {
    params: restaurantId
      ? { restaurantId }
      : undefined,
  });

  const responseData = response.data;

  // Backend returns:
  // { success: true, message: "...", data: [...] }
  if (
    responseData &&
    typeof responseData === "object" &&
    "success" in responseData &&
    "data" in responseData
  ) {
    const data = responseData.data;

    if (Array.isArray(data)) {
  return data.map(normalizeBranch);
}

    if (
      data &&
      typeof data === "object" &&
      "branches" in data &&
      Array.isArray(data.branches)
    ) {
      return data.branches.map(normalizeBranch);
    }
  }

  // Fallback if API directly returns an array.
  if (Array.isArray(responseData)) {
    return responseData.map(normalizeBranch);
  }

  // Fallback if API directly returns { branches: [...] }.
  if (
    responseData &&
    typeof responseData === "object" &&
    "branches" in responseData &&
    Array.isArray(responseData.branches)
  ) {
    return responseData.branches.map(normalizeBranch);
  }

  return [];
}

export async function getBranch(
  branchId: string,
): Promise<Branch> {
  const response = await apiClient.get<
    ApiResponse<Branch> | Branch
  >(`/branches/${branchId}`);

  const responseData = response.data;

  if (
    responseData &&
    typeof responseData === "object" &&
    "success" in responseData &&
    "data" in responseData
  ) {
    return responseData.data;
  }

  return responseData as Branch;
}

export async function createBranch(
  data: CreateBranchData,
): Promise<Branch> {
  const response = await apiClient.post<
    ApiResponse<Branch> | Branch
  >("/branches", data);

  const responseData = response.data;

  if (
    responseData &&
    typeof responseData === "object" &&
    "success" in responseData &&
    "data" in responseData
  ) {
    /*
     * Some backend implementations may return the
     * created branch directly, while others may return
     * a list. Handle both safely.
     */
    if (Array.isArray(responseData.data)) {
      return responseData.data[0] as Branch;
    }

    return responseData.data;
  }

  return responseData as Branch;
}

export async function updateBranch(
  branchId: string,
  data: UpdateBranchData,
): Promise<Branch> {
  const response = await apiClient.patch<
    ApiResponse<Branch> | Branch
  >(`/branches/${branchId}`, data);

  const responseData = response.data;

  if (
    responseData &&
    typeof responseData === "object" &&
    "success" in responseData &&
    "data" in responseData
  ) {
    return responseData.data;
  }

  return responseData as Branch;
}

export async function deleteBranch(
  branchId: string,
): Promise<void> {
  await apiClient.delete(`/branches/${branchId}`);
}

export async function updateBranchStatus(
  branchId: string,
  status: "ACTIVE" | "INACTIVE",
): Promise<Branch> {
  const response = await apiClient.patch<
    ApiResponse<Branch> | Branch
  >(`/branches/${branchId}/status`, {
    isActive: status === "ACTIVE",
  });

  const responseData = response.data;

  if (
    responseData &&
    typeof responseData === "object" &&
    "success" in responseData &&
    "data" in responseData
  ) {
    return responseData.data;
  }

  return responseData as Branch;
}