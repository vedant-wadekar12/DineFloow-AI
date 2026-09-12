export type TableStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "RESERVED"
  | "INACTIVE";

export type TableType =
  | "STANDARD"
  | "COUPLE"
  | "FAMILY"
  | "OUTDOOR"
  | "VIP"
  | "BAR";

export interface RestaurantTable {
  id: string;

  restaurantId: string;
  branchId: string;
  floorId: string;

  name: string;
  tableNumber?: string;

  type: TableType;

  capacity: number;

  status: TableStatus;

  description?: string;

  qrCode?: string;
  qrUrl?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTableData {
  restaurantId: string;
  branchId: string;
  floorId: string;

  name: string;
  tableNumber?: string;

  type: TableType;

  capacity: number;

  description?: string;
}

export interface UpdateTableData {
  name?: string;
  tableNumber?: string;

  type?: TableType;

  capacity?: number;

  status?: TableStatus;

  description?: string;
}