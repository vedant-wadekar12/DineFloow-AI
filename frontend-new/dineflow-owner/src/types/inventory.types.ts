export type InventoryType =
  | "RAW_MATERIAL"
  | "PACKAGING"
  | "BEVERAGE"
  | "OTHER";

export type InventoryUnit =
  | "KG"
  | "G"
  | "L"
  | "ML"
  | "PCS"
  | "PACK"
  | "BOX"
  | "BOTTLE";

export interface InventoryItem {
  id: string;
  restaurantId: string;
  branchId?: string;

  name: string;
  sku: string;

  type: InventoryType;
  unit: InventoryUnit;

  currentStock: number;
  minimumStock: number;
  maximumStock?: number;

  costPrice?: number;

  supplierId?: string;
  description?: string;

  isActive: boolean;
  isDeleted?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInventoryData {
  restaurantId: string;
  branchId?: string;

  name: string;
  sku: string;

  type: InventoryType;
  unit: InventoryUnit;

  currentStock?: number;
  minimumStock?: number;
  maximumStock?: number;

  costPrice?: number;

  supplierId?: string;
  description?: string;
}

export interface UpdateInventoryData {
  branchId?: string;

  name?: string;
  sku?: string;

  type?: InventoryType;
  unit?: InventoryUnit;

  minimumStock?: number;
  maximumStock?: number;

  costPrice?: number;

  supplierId?: string;
  description?: string;
}

export type StockTransactionType =
  | "PURCHASE"
  | "CONSUMPTION"
  | "ADJUSTMENT"
  | "WASTE"
  | "RETURN";

export interface StockAdjustmentData {
  inventoryItemId: string;
  quantity: number;
  type: StockTransactionType;
  reason?: string;
  referenceType?: string;
  referenceId?: string;
}

export interface StockTransaction {
  id: string;

  inventoryItemId: string;
  restaurantId: string;
  branchId?: string;

  type: StockTransactionType;

  quantity: number;
  previousStock: number;
  newStock: number;

  reason?: string;
  referenceType?: string;
  referenceId?: string;

  createdBy?: string;
  createdAt?: string;
}

export interface MenuRecipe {
  id: string;

  restaurantId: string;
  menuItemId: string;
  inventoryItemId: string;

  quantity: number;

  createdBy?: string;
  updatedBy?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMenuRecipeData {
  restaurantId: string;
  menuItemId: string;
  inventoryItemId: string;
  quantity: number;
}

export interface UpdateMenuRecipeData {
  quantity: number;
}

export type InventoryStockStatus =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK";

export interface InventoryStatsData {
  totalItems: number;
  activeItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalInventoryValue: number;
}