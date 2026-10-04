export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "served"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type OrderType =
  | "dine-in"
  | "takeaway"
  | "delivery";

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;

  quantity: number;
  price: number;

  subtotal: number;

  notes?: string;
}

export interface Order {
  id: string;

  restaurantId: string;
  branchId?: string;

  tableId?: string;
  tableNumber?: string;

  customerId?: string;
  customerName?: string;
  customerPhone?: string;

  orderNumber: string;

  orderType: OrderType;

  items: OrderItem[];

  subtotal: number;
  tax: number;
  discount: number;
  total: number;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  notes?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderItemData {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface CreateOrderData {
  branchId?: string;
  tableId?: string;

  customerName?: string;
  customerPhone?: string;

  orderType: OrderType;

  items: CreateOrderItemData[];

  discount?: number;
  tax?: number;

  notes?: string;
}

export interface UpdateOrderData {
  tableId?: string;

  customerName?: string;
  customerPhone?: string;

  orderType?: OrderType;

  discount?: number;
  tax?: number;

  notes?: string;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
}

export interface OrderStatsData {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}