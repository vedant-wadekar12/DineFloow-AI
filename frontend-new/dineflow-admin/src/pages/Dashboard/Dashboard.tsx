import { useEffect, useState } from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RevenueChart from "@/components/dashboard/RevenueChart";
import OrderStatusCard from "@/components/dashboard/OrderStatusCard";
import TableStatusCard from "@/components/dashboard/TableStatusCard";
import KitchenSnapshot from "@/components/dashboard/KitchenSnapshot";
import RecentOrders from "@/components/dashboard/RecentOrders";
import PopularItems from "@/components/dashboard/PopularItems";
import QuickActions from "@/components/dashboard/QuickActions";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";

import {
  getDashboardStats,
  getRevenueData,
  getOrderStatusData,
  getTableStatusData,
  getRecentOrders,
  getPopularItems,
  getKitchenSnapshot,
} from "@/services/dashboard/dashboard.service";

import type {
  DashboardStat,
  RevenueDataPoint,
  OrderStatusData,
  TableStatusData,
  RecentOrder,
  PopularItem,
  KitchenSnapshotData,
} from "@/types/dashboard.types";

function Dashboard() {
  const [stats, setStats] = useState<
    DashboardStat[]
  >([]);

  const [revenue, setRevenue] = useState<
    RevenueDataPoint[]
  >([]);

  const [orderStatus, setOrderStatus] = useState<
    OrderStatusData[]
  >([]);

  const [tableStatus, setTableStatus] = useState<
    TableStatusData[]
  >([]);

  const [recentOrders, setRecentOrders] = useState<
    RecentOrder[]
  >([]);

  const [popularItems, setPopularItems] = useState<
    PopularItem[]
  >([]);

  const [kitchen, setKitchen] =
    useState<KitchenSnapshotData | null>(
      null,
    );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(false);

        const [
          statsData,
          revenueData,
          orderStatusData,
          tableStatusData,
          recentOrdersData,
          popularItemsData,
          kitchenData,
        ] = await Promise.all([
          getDashboardStats(),
          getRevenueData(),
          getOrderStatusData(),
          getTableStatusData(),
          getRecentOrders(),
          getPopularItems(),
          getKitchenSnapshot(),
        ]);

        setStats(statsData);
        setRevenue(revenueData);
        setOrderStatus(orderStatusData);
        setTableStatus(tableStatusData);
        setRecentOrders(recentOrdersData);
        setPopularItems(popularItemsData);
        setKitchen(kitchenData);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <LoadingState message="Loading your dashboard..." />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        description="There was a problem loading your restaurant data."
      />
    );
  }

  if (!kitchen) {
    return (
      <ErrorState
        title="Dashboard data unavailable"
        description="No dashboard information is currently available."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader />

      {/* KPI */}
      <DashboardStats stats={stats} />

      {/* Revenue + Order Status */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart data={revenue} />
        </div>

        <OrderStatusCard data={orderStatus} />
      </div>

      {/* Operations */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <TableStatusCard data={tableStatus} />

        <KitchenSnapshot data={kitchen} />

        <PopularItems items={popularItems} />
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={recentOrders} />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}

export default Dashboard;