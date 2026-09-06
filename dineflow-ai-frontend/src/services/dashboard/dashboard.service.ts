import type {
  DashboardStat,
  RevenueDataPoint,
  OrderStatusData,
  TableStatusData,
  RecentOrder,
  PopularItem,
  KitchenSnapshotData,
} from "@/types/dashboard.types";

export async function getDashboardStats(): Promise<
  DashboardStat[]
> {
  return [
    {
      title: "Today's Revenue",
      value: "₹48,650",
      change: "+12.5%",
      trend: "up",
      description: "vs. yesterday",
    },
    {
      title: "Orders",
      value: "186",
      change: "+8.2%",
      trend: "up",
      description: "vs. yesterday",
    },
    {
      title: "Customers",
      value: "142",
      change: "+5.4%",
      trend: "up",
      description: "vs. yesterday",
    },
    {
      title: "Avg. Order Value",
      value: "₹261.56",
      change: "-2.1%",
      trend: "down",
      description: "vs. yesterday",
    },
  ];
}

export async function getRevenueData(): Promise<
  RevenueDataPoint[]
> {
  return [
    {
      name: "Mon",
      revenue: 32000,
      orders: 124,
    },
    {
      name: "Tue",
      revenue: 38500,
      orders: 138,
    },
    {
      name: "Wed",
      revenue: 35400,
      orders: 131,
    },
    {
      name: "Thu",
      revenue: 42100,
      orders: 152,
    },
    {
      name: "Fri",
      revenue: 46300,
      orders: 171,
    },
    {
      name: "Sat",
      revenue: 58200,
      orders: 218,
    },
    {
      name: "Sun",
      revenue: 48650,
      orders: 186,
    },
  ];
}

export async function getOrderStatusData(): Promise<
  OrderStatusData[]
> {
  return [
    {
      name: "Completed",
      value: 118,
    },
    {
      name: "Preparing",
      value: 32,
    },
    {
      name: "Pending",
      value: 21,
    },
    {
      name: "Cancelled",
      value: 15,
    },
  ];
}

export async function getTableStatusData(): Promise<
  TableStatusData[]
> {
  return [
    {
      status: "Available",
      count: 18,
    },
    {
      status: "Occupied",
      count: 14,
    },
    {
      status: "Reserved",
      count: 6,
    },
    {
      status: "Cleaning",
      count: 4,
    },
  ];
}

export async function getRecentOrders(): Promise<
  RecentOrder[]
> {
  return [
    {
      id: "#DF-1048",
      customer: "Rahul Sharma",
      table: "T-12",
      items: 4,
      amount: 1240,
      status: "Completed",
      time: "2 min ago",
    },
    {
      id: "#DF-1047",
      customer: "Priya Patil",
      table: "T-08",
      items: 3,
      amount: 860,
      status: "Preparing",
      time: "5 min ago",
    },
    {
      id: "#DF-1046",
      customer: "Amit Shah",
      table: "T-21",
      items: 6,
      amount: 2180,
      status: "Pending",
      time: "8 min ago",
    },
    {
      id: "#DF-1045",
      customer: "Sneha Joshi",
      table: "T-05",
      items: 2,
      amount: 540,
      status: "Completed",
      time: "12 min ago",
    },
    {
      id: "#DF-1044",
      customer: "Vikram Mehta",
      table: "T-17",
      items: 5,
      amount: 1560,
      status: "Completed",
      time: "18 min ago",
    },
  ];
}

export async function getPopularItems(): Promise<
  PopularItem[]
> {
  return [
    {
      name: "Paneer Butter Masala",
      category: "Main Course",
      orders: 86,
      revenue: 25800,
    },
    {
      name: "Masala Dosa",
      category: "South Indian",
      orders: 74,
      revenue: 11100,
    },
    {
      name: "Veg Biryani",
      category: "Rice",
      orders: 68,
      revenue: 13600,
    },
    {
      name: "Butter Naan",
      category: "Breads",
      orders: 61,
      revenue: 4880,
    },
    {
      name: "Cold Coffee",
      category: "Beverages",
      orders: 53,
      revenue: 6360,
    },
  ];
}

export async function getKitchenSnapshot(): Promise<
  KitchenSnapshotData
> {
  return {
    pending: 12,
    preparing: 8,
    ready: 5,
    delayed: 2,
  };
}