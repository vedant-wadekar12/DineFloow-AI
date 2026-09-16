export interface CreateInventoryItemDto {
  restaurantId: string;
  branchId?: string;

  name: string;
  sku: string;

  type:
    | "RAW_MATERIAL"
    | "PACKAGING"
    | "BEVERAGE"
    | "OTHER";

  unit:
    | "KG"
    | "G"
    | "L"
    | "ML"
    | "PCS"
    | "PACK"
    | "BOX"
    | "BOTTLE";

  currentStock?: number;
  minimumStock?: number;
  maximumStock?: number;

  costPrice?: number;

  supplierId?: string;

  description?: string;
}

export interface UpdateInventoryItemDto {
  branchId?: string;

  name?: string;
  sku?: string;

  type?:
    | "RAW_MATERIAL"
    | "PACKAGING"
    | "BEVERAGE"
    | "OTHER";

  unit?:
    | "KG"
    | "G"
    | "L"
    | "ML"
    | "PCS"
    | "PACK"
    | "BOX"
    | "BOTTLE";

  minimumStock?: number;
  maximumStock?: number;

  costPrice?: number;

  supplierId?: string;

  description?: string;
}