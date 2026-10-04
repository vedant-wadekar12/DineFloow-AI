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

  /*
   * LOAD ORDERS
   */

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
    } catch (error) {
      console.error(
        "Failed to load orders:",
        error,
      );

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

  /*
   * FILTER ORDERS
   */

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
            order.status === status;

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

  /*
   * CREATE ORDER
   */

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
    } catch (error) {
      console.error(
        "Failed to create order:",
        error,
      );

      setError(
        "Unable to create order.",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * UPDATE ORDER
   */

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
    } catch (error) {
      console.error(
        "Failed to update order:",
        error,
      );

      setError(
        "Unable to update order.",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * UPDATE STATUS
   */

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
      } catch (error) {
        console.error(
          "Failed to update order status:",
          error,
        );

        setError(
          "Unable to update order status.",
        );
      } finally {
        setUpdatingStatus(false);
      }
    };

  /*
   * CANCEL ORDER
   */

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
      } catch (error) {
        console.error(
          "Failed to cancel order:",
          error,
        );

        setError(
          "Unable to cancel order.",
        );
      } finally {
        setCancelling(false);
      }
    };

  /*
   * OPEN VIEW
   */

  const openView = (
    order: Order,
  ) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  /*
   * OPEN EDIT
   */

  const openEdit = (
    order: Order,
  ) => {
    setSelectedOrder(order);
    setFormOpen(true);
  };

  /*
   * OPEN STATUS
   */

  const openStatus = (
    order: Order,
  ) => {
    setSelectedOrder(order);
    setStatusDialogOpen(true);
  };

  /*
   * OPEN CANCEL
   */

  const openCancel = (
    order: Order,
  ) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  /*
   * LOADING
   */

  if (loading) {
    return (
      <LoadingState
        message="Loading orders..."
      />
    );
  }

  /*
   * ERROR
   */

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

  /*
   * PAGE
   */

  return (
    <div className="space-y-6">
      {/* HEADER */}

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

      {/* STATS */}

      <OrderStats
        orders={orders}
      />

      {/* FILTERS */}

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

      {/* REFRESH */}

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

      {/* ORDERS */}

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
          {/* DESKTOP */}

          <div className="hidden md:block">
            <OrderTable
              orders={filteredOrders}
              onView={openView}
              onEdit={openEdit}
              onStatus={openStatus}
              onCancel={openCancel}
            />
          </div>

          {/* MOBILE */}

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

      {/* CREATE / EDIT DIALOG */}

      <OrderFormDialog
        open={formOpen}
        order={selectedOrder}
        loading={saving}
        onOpenChange={setFormOpen}
        onSubmit={async (values) => {
          if (selectedOrder) {
            await handleUpdate(
              values,
            );
          } else {
            await handleCreate(
              values as CreateOrderData,
            );
          }
        }}
      />

      {/* DETAILS */}

      <OrderDetailsDialog
        open={detailsOpen}
        order={selectedOrder}
        onOpenChange={setDetailsOpen}
      />

      {/* STATUS */}

      <UpdateOrderStatusDialog
        open={statusDialogOpen}
        order={selectedOrder}
        loading={updatingStatus}
        onOpenChange={
          setStatusDialogOpen
        }
        onSubmit={
          handleStatusUpdate
        }
      />

      {/* CANCEL */}

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