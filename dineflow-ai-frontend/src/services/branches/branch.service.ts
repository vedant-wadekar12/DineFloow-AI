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

export async function getBranches(
  restaurantId?: string,
): Promise<Branch[]> {
  const response = await apiClient.get<BranchListResponse | Branch[]>(
    "/branches",
    {
      params: restaurantId ? { restaurantId } : undefined,
    },
  );

  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  return data.branches ?? [];
}

export async function getBranch(
  branchId: string,
): Promise<Branch> {
  const response = await apiClient.get<Branch>(
    `/branches/${branchId}`,
  );

  return response.data;
}

export async function createBranch(
  data: CreateBranchData,
): Promise<Branch> {
  const response = await apiClient.post<Branch>(
    "/branches",
    data,
  );

  return response.data;
}

export async function updateBranch(
  branchId: string,
  data: UpdateBranchData,
): Promise<Branch> {
  const response = await apiClient.patch<Branch>(
    `/branches/${branchId}`,
    data,
  );

  return response.data;
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
  const response = await apiClient.patch<Branch>(
    `/branches/${branchId}/status`,
    { status },
  );

  return response.data;
}