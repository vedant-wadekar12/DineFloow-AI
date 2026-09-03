export interface CreateFloorDto {
  branchId: string;
  name: string;
  code: string;
  description?: string;
  floorNumber: number;
}

export interface UpdateFloorDto {
  name?: string;
  code?: string;
  description?: string;
  floorNumber?: number;
}