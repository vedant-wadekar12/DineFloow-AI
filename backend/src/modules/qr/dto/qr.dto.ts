export interface CreateQRDto {
  restaurantId: string;
  branchId: string;
  floorId: string;
  tableId: string;
}

export interface UpdateQRStatusDto {
  isActive: boolean;
}