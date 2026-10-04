export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  description: string;
}

export interface RevenueDataPoint {
  name: string;
  revenue: number;
  orders: number;
}

export interface OrderStatusData {
  name: string;
  value: number;
}

export interface TableStatusData {
  status: string;
  count: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  table: string;
  items: number;
  amount: number;
  status:
    | "Completed"
    | "Preparing"
    | "Pending"
    | "Cancelled";
  time: string;
}

export interface PopularItem {
  name: string;
  category: string;
  orders: number;
  revenue: number;
}

export interface KitchenSnapshotData {
  pending: number;
  preparing: number;
  ready: number;
  delayed: number;
}