export const INVENTORY_UNITS = {
  KG: "KG",
  G: "G",
  L: "L",
  ML: "ML",
  PCS: "PCS",
  PACK: "PACK",
  BOX: "BOX",
  BOTTLE: "BOTTLE",
} as const;

export type InventoryUnit =
  (typeof INVENTORY_UNITS)[keyof typeof INVENTORY_UNITS];

export const INVENTORY_TYPES = {
  RAW_MATERIAL: "RAW_MATERIAL",
  PACKAGING: "PACKAGING",
  BEVERAGE: "BEVERAGE",
  OTHER: "OTHER",
} as const;

export type InventoryType =
  (typeof INVENTORY_TYPES)[keyof typeof INVENTORY_TYPES];

export const STOCK_TRANSACTION_TYPES = {
  PURCHASE: "PURCHASE",
  CONSUMPTION: "CONSUMPTION",
  ADJUSTMENT: "ADJUSTMENT",
  WASTE: "WASTE",
  RETURN: "RETURN",
} as const;

export type StockTransactionType =
  (typeof STOCK_TRANSACTION_TYPES)[keyof typeof STOCK_TRANSACTION_TYPES];