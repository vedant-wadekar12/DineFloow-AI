export type TableStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "RESERVED"
  | "INACTIVE"
  | "CLEANING"
  | "OUT_OF_SERVICE";

export type TableType =
  | "STANDARD"
  | "COUPLE"
  | "FAMILY"
  | "OUTDOOR"
  | "VIP"
  | "BAR";

export interface RestaurantTable {
  id: string;

  restaurantId?: string;
  branchId: string;
  floorId: string;

  name: string;
  tableNumber: number;

  type?: TableType;

  capacity: number;

  status: TableStatus;

  description?: string;

  qrCode?: string;
  qrUrl?: string;

  position?: {
    x: number;
    y: number;
  };

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTableData {
  restaurantId: string;
  branchId: string;
  floorId: string;

  name: string;
  tableNumber: number;

  type?: TableType;

  capacity: number;

  description?: string;

  position?: {
    x: number;
    y: number;
  };
}

export interface UpdateTableData {
  name?: string;

  tableNumber?: number;

  type?: TableType;

  capacity?: number;

  status?: TableStatus;

  description?: string;

  position?: {
    x: number;
    y: number;
  };
}