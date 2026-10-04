export type FloorStatus = "ACTIVE" | "INACTIVE";

export interface Floor {
  id: string;
  restaurantId: string;
  branchId: string;

  name: string;
  code?: string;

  description?: string;

  floorNumber?: number;

  status: FloorStatus;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFloorData {
  restaurantId: string;
  branchId: string;

  name: string;
  code?: string;

  description?: string;

  floorNumber?: number;
}

export interface UpdateFloorData {
  name?: string;
  code?: string;
  description?: string;
  floorNumber?: number;
  status?: FloorStatus;
}