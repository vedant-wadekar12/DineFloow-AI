import apiClient from "@/services/api/api-client";

import type {
  Floor,
  CreateFloorData,
  UpdateFloorData,
} from "@/types/floor.types";

interface BackendFloor {
  _id: string;
  branchId:
    | string
    | {
        _id: string;
      };
  name: string;
  code?: string;
  description?: string;
  floorNumber?: number;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface BackendResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function normalizeFloor(
  floor: BackendFloor,
): Floor {
  const branchId =
    typeof floor.branchId === "string"
      ? floor.branchId
      : floor.branchId?._id;

  return {
    id: floor._id,
    restaurantId: "",
    branchId,
    name: floor.name,
    code: floor.code,
    description: floor.description,
    floorNumber: floor.floorNumber,
    status: floor.isActive
      ? "ACTIVE"
      : "INACTIVE",
    createdAt: floor.createdAt,
    updatedAt: floor.updatedAt,
  };
}

export async function getFloors(
  branchId: string,
): Promise<Floor[]> {
  if (!branchId) {
    return [];
  }

  const response =
    await apiClient.get<
      BackendResponse<BackendFloor[]>
    >(
      `/floors/branch/${encodeURIComponent(
        branchId,
      )}`,
    );

  const data = response.data.data ?? [];

  return data.map(normalizeFloor);
}

export async function getFloor(
  floorId: string,
): Promise<Floor> {
  const response =
    await apiClient.get<
      BackendResponse<BackendFloor>
    >(`/floors/${floorId}`);

  return normalizeFloor(
    response.data.data,
  );
}

export async function createFloor(
  data: CreateFloorData,
): Promise<Floor> {
  const response =
    await apiClient.post<
      BackendResponse<BackendFloor>
    >("/floors", {
      branchId: data.branchId,
      name: data.name,
      code: data.code,
      description: data.description,
      floorNumber: data.floorNumber,
    });

  return normalizeFloor(
    response.data.data,
  );
}

export async function updateFloor(
  floorId: string,
  data: UpdateFloorData,
): Promise<Floor> {
  const response =
    await apiClient.patch<
      BackendResponse<BackendFloor>
    >(`/floors/${floorId}`, {
      name: data.name,
      code: data.code,
      description: data.description,
      floorNumber: data.floorNumber,
    });

  return normalizeFloor(
    response.data.data,
  );
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
    await apiClient.patch<
      BackendResponse<BackendFloor>
    >(
      `/floors/${floorId}/status`,
      {
        isActive:
          status === "ACTIVE",
      },
    );

  return normalizeFloor(
    response.data.data,
  );
}