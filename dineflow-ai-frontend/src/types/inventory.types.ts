export type InventoryUnit =
  | "kg"
  | "g"
  | "l"
  | "ml"
  | "piece"
  | "packet"
  | "box"
  | "bottle"
  | "dozen";

export interface InventoryItem {
  id: string;

  restaurantId: string;
  branchId?: string;

  name: string;
  description?: string;

  category?: string;
  sku?: string;

  unit: InventoryUnit;

  currentStock: number;
  minimumStock: number;

  costPerUnit: number;

  supplierName?: string;
  supplierPhone?: string;

  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInventoryData {
  name: string;
  description?: string;

  category?: string;
  sku?: string;

  unit: InventoryUnit;

  currentStock: number;
  minimumStock: number;

  costPerUnit: number;

  supplierName?: string;
  supplierPhone?: string;

  branchId?: string;

  isActive: boolean;
}

export interface UpdateInventoryData {
  name?: string;
  description?: string;

  category?: string;
  sku?: string;

  unit?: InventoryUnit;

  minimumStock?: number;
  costPerUnit?: number;

  supplierName?: string;
  supplierPhone?: string;

  branchId?: string;

  isActive?: boolean;
}

export interface StockAdjustmentData {
  quantity: number;
  type: "add" | "remove";
  reason?: string;
}

export type InventoryStockStatus =
  | "in-stock"
  | "low-stock"
  | "out-of-stock";

export interface InventoryStatsData {
  totalItems: number;
  activeItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalInventoryValue: number;
}