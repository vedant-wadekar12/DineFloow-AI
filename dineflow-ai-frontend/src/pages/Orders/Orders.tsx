import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import OrderStats from "@/components/orders/OrderStats";
import OrderFilters from "@/components/orders/OrderFilters";
import OrderTable from "@/components/orders/OrderTable";
import OrderCard from "@/components/orders/OrderCard";
import OrderDetailsDialog from "@/components/orders/OrderDetailsDialog";
import OrderFormDialog from "@/components/orders/OrderFormDialog";
import UpdateOrderStatusDialog from "@/components/orders/UpdateOrderStatusDialog";
import CancelOrderDialog from "@/components/orders/CancelOrderDialog";

import * as orderService from "@/services/orders/order.service";

import type {
  CreateOrderData,
  Order,
  OrderStatus,
  UpdateOrderData,
} from "@/types/order.types";

export default function Orders() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [orderType, setOrderType] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [
    detailsOpen,
    setDetailsOpen,
  ] = useState(false);

  const [
    statusDialogOpen,
    setStatusDialogOpen,
  ] = useState(false);

  const [
    cancelDialogOpen,
    setCancelDialogOpen,
  ] = useState(false);

  const [
    selectedOrder,
    setSelectedOrder,
  ] = useState<Order | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [
    updatingStatus,
    setUpdatingStatus,
  ] = useState(false);

  const [
    cancelling,
    setCancelling,
  ] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await orderService.getOrders();

      setOrders(
        Array.isArray(data)
          ? data
          : [],
      );
    } catch {
      setError(
        "Unable to load orders.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const filteredOrders =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return orders.filter(
        (order) => {
          const matchesSearch =
            !normalizedSearch ||
            order.orderNumber
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            order.customerName
              ?.toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            order.customerPhone
              ?.toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            order.tableNumber
              ?.toLowerCase()
              .includes(
                normalizedSearch,
              );

          const matchesStatus =
            !status ||
            order.status ===
              status;

          const matchesType =
            !orderType ||
            order.orderType ===
              orderType;

          return (
            Boolean(
              matchesSearch,
            ) &&
            matchesStatus &&
            matchesType
          );
        },
      );
    }, [
      orders,
      search,
      status,
      orderType,
    ]);

  const handleCreate = async (
    values: CreateOrderData,
  ) => {
    try {
      setSaving(true);

      const created =
        await orderService.createOrder(
          values,
        );

      setOrders((current) => [
        created,
        ...current,
      ]);

      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (
    values: UpdateOrderData,
  ) => {
    if (!selectedOrder) {
      return;
    }

    try {
      setSaving(true);

      const updated =
        await orderService.updateOrder(
          selectedOrder.id,
          values,
        );

      setOrders((current) =>
        current.map((order) =>
          order.id ===
          selectedOrder.id
            ? updated
            : order,
        ),
      );

      setFormOpen(false);
      setSelectedOrder(null);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate =
    async (
      newStatus: OrderStatus,
    ) => {
      if (!selectedOrder) {
        return;
      }

      try {
        setUpdatingStatus(true);

        const updated =
          await orderService.updateOrderStatus(
            selectedOrder.id,
            {
              status: newStatus,
            },
          );

        setOrders((current) =>
          current.map(
            (order) =>
              order.id ===
              selectedOrder.id
                ? updated
                : order,
          ),
        );

        setStatusDialogOpen(false);
        setSelectedOrder(null);
      } finally {
        setUpdatingStatus(false);
      }
    };

  const handleCancel =
    async () => {
      if (!selectedOrder) {
        return;
      }

      try {
        setCancelling(true);

        const updated =
          await orderService.cancelOrder(
            selectedOrder.id,
          );

        setOrders((current) =>
          current.map(
            (order) =>
              order.id ===
              selectedOrder.id
                ? updated
                : order,
          ),
        );

        setCancelDialogOpen(false);
        setSelectedOrder(null);
      } finally {
        setCancelling(false);
      }
    };

  const openView = (
    order: Order,
  ) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const openEdit = (
    order: Order,
  ) => {
    setSelectedOrder(order);
    setFormOpen(true);
  };

  const openStatus = (
    order: Order,
  ) => {
    setSelectedOrder(order);
    setStatusDialogOpen(true);
  };

  const openCancel = (
    order: Order,
  ) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  if (loading) {
    return (
      <LoadingState
        message="Loading orders..."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() =>
          void loadOrders()
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Orders
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage restaurant orders and
            track their progress.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setSelectedOrder(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <OrderStats
        orders={orders}
      />

      <div className="rounded-xl border bg-card p-4">
        <OrderFilters
          search={search}
          status={status}
          orderType={orderType}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onOrderTypeChange={
            setOrderType
          }
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            void loadOrders()
          }
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description={
            orders.length === 0
              ? "There are no orders yet."
              : "Try changing your search or filters."
          }
          action={
            orders.length === 0 ? (
              <Button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Order
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="hidden md:block">
            <OrderTable
              orders={filteredOrders}
              onView={openView}
              onEdit={openEdit}
              onStatus={openStatus}
              onCancel={openCancel}
            />
          </div>

          <div className="grid gap-4 md:hidden">
            {filteredOrders.map(
              (order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={openView}
                  onEdit={openEdit}
                  onStatus={openStatus}
                  onCancel={openCancel}
                />
              ),
            )}
          </div>
        </>
      )}

      <OrderFormDialog
        open={formOpen}
        order={selectedOrder}
        loading={saving}
        onOpenChange={setFormOpen}
        onSubmit={async (values) => {
          if (selectedOrder) {
            await handleUpdate(values);
          } else {
            await handleCreate(
              values as CreateOrderData,
            );
          }
        }}
      />

      <OrderDetailsDialog
        open={detailsOpen}
        order={selectedOrder}
        onOpenChange={setDetailsOpen}
      />

      <UpdateOrderStatusDialog
        open={statusDialogOpen}
        order={selectedOrder}
        loading={updatingStatus}
        onOpenChange={
          setStatusDialogOpen
        }
        onSubmit={handleStatusUpdate}
      />

      <CancelOrderDialog
        open={cancelDialogOpen}
        order={selectedOrder}
        loading={cancelling}
        onOpenChange={
          setCancelDialogOpen
        }
        onConfirm={handleCancel}
      />
    </div>
  );
}