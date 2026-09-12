import apiClient from "@/services/api/api-client";

import type {
  Floor,
  CreateFloorData,
  UpdateFloorData,
} from "@/types/floor.types";

interface FloorListResponse {
  floors: Floor[];
  total?: number;
}

export async function getFloors(
  branchId?: string,
): Promise<Floor[]> {
  const response =
    await apiClient.get<
      FloorListResponse | Floor[]
    >("/floors", {
      params: branchId
        ? { branchId }
        : undefined,
    });

  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  return data.floors ?? [];
}

export async function getFloor(
  floorId: string,
): Promise<Floor> {
  const response =
    await apiClient.get<Floor>(
      `/floors/${floorId}`,
    );

  return response.data;
}

export async function createFloor(
  data: CreateFloorData,
): Promise<Floor> {
  const response =
    await apiClient.post<Floor>(
      "/floors",
      data,
    );

  return response.data;
}

export async function updateFloor(
  floorId: string,
  data: UpdateFloorData,
): Promise<Floor> {
  const response =
    await apiClient.patch<Floor>(
      `/floors/${floorId}`,
      data,
    );

  return response.data;
}

export async function deleteFloor(
  floorId: string,
): Promise<void> {
  await apiClient.delete(
    `/floors/${floorId}`,
  );
}

export async function updateFloorStatus(
  floorId: string,
  status: "ACTIVE" | "INACTIVE",
): Promise<Floor> {
  const response =
    await apiClient.patch<Floor>(
      `/floors/${floorId}/status`,
      { status },
    );

  return response.data;
}