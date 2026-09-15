import { useEffect, useMemo, useState } from "react";

import { Plus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { useRestaurant } from "@/context/RestaurantContext";
import InventoryStats from "@/components/inventory/InventoryStats";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventoryTable from "@/components/inventory/InventoryTable";
import InventoryItemCard from "@/components/inventory/InventoryItemCard";
import InventoryFormDialog from "@/components/inventory/InventoryFormDialog";
import InventoryDetailsDialog from "@/components/inventory/InventoryDetailsDialog";
import StockAdjustmentDialog from "@/components/inventory/StockAdjustmentDialog";
import DeleteInventoryDialog from "@/components/inventory/DeleteInventoryDialog";

import * as inventoryService from "@/services/inventory/inventory.service";

import type {
  CreateInventoryData,
  InventoryItem,
  StockAdjustmentData,
  UpdateInventoryData,
} from "@/types/inventory.types";

export default function Inventory() {
  const {
  selectedRestaurantId,
} = useRestaurant();

const restaurantId =
  selectedRestaurantId ?? "";

  const [items, setItems] =
    useState<InventoryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [
    stockAdjustmentOpen,
    setStockAdjustmentOpen,
  ] = useState(false);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [selectedItem, setSelectedItem] =
    useState<InventoryItem | null>(
      null,
    );

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [
    adjustingStock,
    setAdjustingStock,
  ] = useState(false);

  const loadInventory = async () => {
  if (!restaurantId) {
    setItems([]);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const data =
      await inventoryService.getInventory(
        restaurantId,
      );

    setItems(
      Array.isArray(data)
        ? data
        : [],
    );
  } catch (error) {
    console.error(
      "Failed to load inventory:",
      error,
    );

    setError(
      "Unable to load inventory.",
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    void loadInventory();
  }, [restaurantId]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        items
          .map(
            (item) =>
              item.category,
          )
          .filter(
            (
              value,
            ): value is string =>
              Boolean(value),
          ),
      ),
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedSearch =
      search
        .trim()
        .toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.name
          .toLowerCase()
          .includes(
            normalizedSearch,
          ) ||
        item.sku
          ?.toLowerCase()
          .includes(
            normalizedSearch,
          ) ||
        item.supplierName
          ?.toLowerCase()
          .includes(
            normalizedSearch,
          );

      const matchesCategory =
        !category ||
        item.category ===
          category;

      let matchesStatus = true;

      if (status === "in-stock") {
        matchesStatus =
          item.currentStock >
          item.minimumStock;
      }

      if (status === "low-stock") {
        matchesStatus =
          item.currentStock > 0 &&
          item.currentStock <=
            item.minimumStock;
      }

      if (status === "out-of-stock") {
        matchesStatus =
          item.currentStock <= 0;
      }

      return (
        Boolean(matchesSearch) &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    items,
    search,
    category,
    status,
  ]);

  const handleCreate = async (
    values: CreateInventoryData,
  ) => {
    try {
      setSaving(true);

      const created =
        await inventoryService.createInventory(
          values,
        );

      setItems((current) => [
        ...current,
        created,
      ]);

      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (
    values: UpdateInventoryData,
  ) => {
    if (!selectedItem) {
      return;
    }

    try {
      setSaving(true);

      const updated =
        await inventoryService.updateInventory(
          selectedItem.id,
          values,
        );

      setItems((current) =>
        current.map((item) =>
          item.id ===
          selectedItem.id
            ? updated
            : item,
        ),
      );

      setFormOpen(false);
      setSelectedItem(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) {
      return;
    }

    try {
      setDeleting(true);

      await inventoryService.deleteInventory(
        selectedItem.id,
      );

      setItems((current) =>
        current.filter(
          (item) =>
            item.id !==
            selectedItem.id,
        ),
      );

      setDeleteDialogOpen(false);
      setSelectedItem(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleStockAdjustment = async (
    values: StockAdjustmentData,
  ) => {
    if (!selectedItem) {
      return;
    }

    try {
      setAdjustingStock(true);

      const updated =
        await inventoryService.adjustStock(
          selectedItem.id,
          values,
        );

      setItems((current) =>
        current.map((item) =>
          item.id ===
          selectedItem.id
            ? updated
            : item,
        ),
      );

      setStockAdjustmentOpen(
        false,
      );

      setSelectedItem(null);
    } finally {
      setAdjustingStock(false);
    }
  };

  if (loading) {
    return (
      <LoadingState message="Loading inventory..." />
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() =>
          void loadInventory()
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track stock, costs, suppliers,
            and inventory levels.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              void loadInventory()
            }
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            type="button"
            onClick={() => {
              setSelectedItem(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <InventoryStats items={items} />

      <div className="rounded-xl border bg-card p-4">
        <InventoryFilters
          search={search}
          category={category}
          status={status}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={
            setCategory
          }
          onStatusChange={setStatus}
        />
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
  title="No inventory items found"
  description={
    items.length === 0
      ? "Start by adding your first inventory item."
      : "Try changing your search or filters."
  }
  action={
    items.length === 0 ? (
      <Button
        type="button"
        onClick={() => {
          setSelectedItem(null);
          setFormOpen(true);
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Inventory Item
      </Button>
    ) : undefined
  }
/>
      ) : (
        <>
          <div className="hidden md:block">
            <InventoryTable
              items={filteredItems}
              onView={(item) => {
                setSelectedItem(
                  item,
                );
                setDetailsOpen(
                  true,
                );
              }}
              onEdit={(item) => {
                setSelectedItem(
                  item,
                );
                setFormOpen(true);
              }}
              onAdjustStock={(item) => {
                setSelectedItem(
                  item,
                );
                setStockAdjustmentOpen(
                  true,
                );
              }}
              onDelete={(item) => {
                setSelectedItem(
                  item,
                );
                setDeleteDialogOpen(
                  true,
                );
              }}
            />
          </div>

          <div className="grid gap-4 md:hidden">
            {filteredItems.map(
              (item) => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onView={(value) => {
                    setSelectedItem(
                      value,
                    );
                    setDetailsOpen(
                      true,
                    );
                  }}
                  onEdit={(value) => {
                    setSelectedItem(
                      value,
                    );
                    setFormOpen(true);
                  }}
                  onAdjustStock={(
                    value,
                  ) => {
                    setSelectedItem(
                      value,
                    );
                    setStockAdjustmentOpen(
                      true,
                    );
                  }}
                  onDelete={(value) => {
                    setSelectedItem(
                      value,
                    );
                    setDeleteDialogOpen(
                      true,
                    );
                  }}
                />
              ),
            )}
          </div>
        </>
      )}

      <InventoryFormDialog
        open={formOpen}
        item={selectedItem}
        loading={saving}
        onOpenChange={setFormOpen}
        onSubmit={async (values) => {
          if (selectedItem) {
            await handleUpdate(
              values,
            );
          } else {
            await handleCreate(
              values,
            );
          }
        }}
      />

      <InventoryDetailsDialog
        open={detailsOpen}
        item={selectedItem}
        onOpenChange={
          setDetailsOpen
        }
      />

      <StockAdjustmentDialog
        open={stockAdjustmentOpen}
        item={selectedItem}
        loading={adjustingStock}
        onOpenChange={
          setStockAdjustmentOpen
        }
        onSubmit={
          handleStockAdjustment
        }
      />

      <DeleteInventoryDialog
        open={deleteDialogOpen}
        item={selectedItem}
        loading={deleting}
        onOpenChange={
          setDeleteDialogOpen
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}