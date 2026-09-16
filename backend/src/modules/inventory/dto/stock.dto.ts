export interface StockAdjustmentDto {
  inventoryItemId: string;

  quantity: number;

  type:
    | "PURCHASE"
    | "CONSUMPTION"
    | "ADJUSTMENT"
    | "WASTE"
    | "RETURN";

  reason?: string;

  referenceType?: string;
  referenceId?: string;
}