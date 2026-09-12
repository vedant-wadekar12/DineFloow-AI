import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import MenuStats from "@/components/menu/MenuStats";
import CategoryList from "@/components/menu/CategoryList";
import MenuItemTable from "@/components/menu/MenuItemTable";
import CategoryFormDialog from "@/components/menu/CategoryFormDialog";
import MenuItemFormDialog from "@/components/menu/MenuItemFormDialog";

import * as menuService from "@/services/menu/menu.service";

import type {
  MenuCategory,
  MenuItem,
  MenuStats as MenuStatsType,
} from "@/types/menu.types";

export default function Menu() {
  const [categories, setCategories] =
    useState<MenuCategory[]>([]);

  const [items, setItems] =
    useState<MenuItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [categoryDialogOpen, setCategoryDialogOpen] =
    useState(false);

  const [itemDialogOpen, setItemDialogOpen] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState<MenuCategory | null>(null);

  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);

  const loadMenu = async () => {
    try {
      setLoading(true);

      const [
        categoryData,
        itemData,
      ] = await Promise.all([
        menuService.getCategories(),
        menuService.getMenuItems(),
      ]);

      setCategories(categoryData);
      setItems(itemData);
    } catch (error) {
      console.error(
        "Failed to load menu:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMenu();
  }, []);

  const stats: MenuStatsType =
    useMemo(() => {
      return {
        totalCategories:
          categories.length,

        activeCategories:
          categories.filter(
            (category) =>
              category.isActive,
          ).length,

        totalItems: items.length,

        availableItems:
          items.filter(
            (item) =>
              item.isAvailable,
          ).length,

        unavailableItems:
          items.filter(
            (item) =>
              !item.isAvailable,
          ).length,

        specialItems:
          items.filter(
            (item) =>
              item.isSpecial,
          ).length,
      };
    }, [categories, items]);

  const filteredItems =
    useMemo(() => {
      return items.filter((item) => {
        const matchesSearch =
          item.name
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            );

        const matchesCategory =
          !selectedCategory ||
          item.categoryId ===
            selectedCategory;

        return (
          matchesSearch &&
          matchesCategory
        );
      });
    }, [
      items,
      search,
      selectedCategory,
    ]);

  const handleCreateCategory =
    async (data: any) => {
      try {
        setSaving(true);

        await menuService.createCategory(
          data,
        );

        setCategoryDialogOpen(false);

        await loadMenu();
      } catch (error) {
        console.error(
          "Failed to create category:",
          error,
        );
      } finally {
        setSaving(false);
      }
    };

  const handleUpdateCategory =
    async (data: any) => {
      if (!editingCategory) return;

      try {
        setSaving(true);

        await menuService.updateCategory(
          editingCategory.id,
          data,
        );

        setCategoryDialogOpen(false);
        setEditingCategory(null);

        await loadMenu();
      } catch (error) {
        console.error(
          "Failed to update category:",
          error,
        );
      } finally {
        setSaving(false);
      }
    };

  const handleCreateItem =
    async (data: any) => {
      try {
        setSaving(true);

        await menuService.createMenuItem(
          data,
        );

        setItemDialogOpen(false);

        await loadMenu();
      } catch (error) {
        console.error(
          "Failed to create item:",
          error,
        );
      } finally {
        setSaving(false);
      }
    };

  const handleUpdateItem =
    async (data: any) => {
      if (!editingItem) return;

      try {
        setSaving(true);

        await menuService.updateMenuItem(
          editingItem.id,
          data,
        );

        setItemDialogOpen(false);
        setEditingItem(null);

        await loadMenu();
      } catch (error) {
        console.error(
          "Failed to update item:",
          error,
        );
      } finally {
        setSaving(false);
      }
    };

  const handleDeleteCategory =
    async (
      category: MenuCategory,
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${category.name}"?`,
        );

      if (!confirmed) return;

      try {
        await menuService.deleteCategory(
          category.id,
        );

        await loadMenu();
      } catch (error) {
        console.error(
          "Failed to delete category:",
          error,
        );
      }
    };

  const handleDeleteItem =
    async (item: MenuItem) => {
      const confirmed =
        window.confirm(
          `Delete "${item.name}"?`,
        );

      if (!confirmed) return;

      try {
        await menuService.deleteMenuItem(
          item.id,
        );

        await loadMenu();
      } catch (error) {
        console.error(
          "Failed to delete item:",
          error,
        );
      }
    };

  if (loading) {
    return (
      <div className="p-6">
        Loading menu...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold">
            Menu Management
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage your restaurant categories
            and menu items.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setItemDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {/* STATS */}

      <MenuStats stats={stats} />

      {/* CATEGORIES */}

      <CategoryList
        categories={categories}
        onCreate={() => {
          setEditingCategory(null);
          setCategoryDialogOpen(true);
        }}
        onEdit={(category) => {
          setEditingCategory(category);
          setCategoryDialogOpen(true);
        }}
        onDelete={handleDeleteCategory}
      />

      {/* FILTERS */}

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search menu items..."
            className="pl-9"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(
              event.target.value,
            )
          }
          className="rounded-md border bg-background px-3 py-2"
        >
          <option value="">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* ITEMS */}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Menu Items
          </h2>

          <span className="text-sm text-muted-foreground">
            {filteredItems.length} items
          </span>
        </div>

        <MenuItemTable
          items={filteredItems}
          categories={categories}
          onEdit={(item) => {
            setEditingItem(item);
            setItemDialogOpen(true);
          }}
          onDelete={handleDeleteItem}
        />
      </div>

      {/* CATEGORY DIALOG */}

      <CategoryFormDialog
        open={categoryDialogOpen}
        category={editingCategory}
        loading={saving}
        onOpenChange={
          setCategoryDialogOpen
        }
        onSubmit={
          editingCategory
            ? handleUpdateCategory
            : handleCreateCategory
        }
      />

      {/* ITEM DIALOG */}

      <MenuItemFormDialog
        open={itemDialogOpen}
        item={editingItem}
        categories={categories}
        loading={saving}
        onOpenChange={setItemDialogOpen}
        onSubmit={
          editingItem
            ? handleUpdateItem
            : handleCreateItem
        }
      />
    </div>
  );
}