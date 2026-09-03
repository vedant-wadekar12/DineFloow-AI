import { TableStatus } from "../models/table.model";

export interface CreateTableDto {
  branchId: string;
  floorId: string;
  name: string;
  tableNumber: number;
  capacity: number;
  position?: {
    x: number;
    y: number;
  };
}

export interface UpdateTableDto {
  name?: string;
  tableNumber?: number;
  capacity?: number;
  position?: {
    x: number;
    y: number;
  };
}

export interface UpdateTableStatusDto {
  status: TableStatus;
}