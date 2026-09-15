import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useRestaurant } from "@/context/RestaurantContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import MenuStats from "@/components/menu/MenuStats";
import CategoryList from "@/components/menu/CategoryList";
import MenuItemTable from "@/components/menu/MenuItemTable";
import CategoryFormDialog, {
  type CategoryFormData,
} from "@/components/menu/CategoryFormDialog";
import MenuItemFormDialog, {
  type MenuItemFormData,
} from "@/components/menu/MenuItemFormDialog";

import * as menuService from "@/services/menu/menu.service";

import type {
  CreateCategoryData,
  CreateMenuItemData,
  MenuCategory,
  MenuItem,
  MenuStats as MenuStatsType,
  UpdateCategoryData,
  UpdateMenuItemData,
} from "@/types/menu.types";

export default function Menu() {
  const { user } = useAuth();

const {
  selectedRestaurant,
  selectedRestaurantId,
} = useRestaurant();

const restaurantId =
  selectedRestaurantId;console.log("Logged in user:", user);
console.log(
  "Selected restaurant:",
  selectedRestaurant,
);
console.log(
  "Selected restaurant ID:",
  selectedRestaurantId,
);

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

  /*
   * LOAD MENU
   */

  const loadMenu = async () => {
    if (!restaurantId) {
      setCategories([]);
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [
        categoryData,
        itemData,
      ] = await Promise.all([
        menuService.getCategories(
          restaurantId,
        ),

        menuService.getMenuItems(
          restaurantId,
        ),
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
    if (!restaurantId) {
      setCategories([]);
      setItems([]);
      setLoading(false);
      return;
    }

    void loadMenu();
  }, [restaurantId]);

  /*
   * STATS
   */

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

        totalItems:
          items.length,

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
    }, [
      categories,
      items,
    ]);

  /*
   * FILTER ITEMS
   */

  const filteredItems =
    useMemo(() => {
      const searchValue =
        search.toLowerCase().trim();

      return items.filter(
        (item) => {
          const matchesSearch =
            item.name
              .toLowerCase()
              .includes(searchValue);

          const matchesCategory =
            !selectedCategory ||
            item.categoryId ===
              selectedCategory;

          return (
            matchesSearch &&
            matchesCategory
          );
        },
      );
    }, [
      items,
      search,
      selectedCategory,
    ]);

  /*
   * CREATE CATEGORY
   */

  const handleCreateCategory = async (data: CategoryFormData) => {
  if (!restaurantId) return;

  try {
    setSaving(true);

    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const payload: CreateCategoryData = {
      restaurantId,
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || undefined,
      sortOrder: data.sortOrder,
    };

    await menuService.createCategory(payload);

    setCategoryDialogOpen(false);
    await loadMenu();
  } catch (error) {
    console.error("Failed to create category:", error);
  } finally {
    setSaving(false);
  }
};

  /*
   * UPDATE CATEGORY
   */

  const handleUpdateCategory = async (data: CategoryFormData) => {
  if (!editingCategory) return;

  try {
    setSaving(true);

    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const payload: UpdateCategoryData = {
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || undefined,
      sortOrder: data.sortOrder,
    };

    await menuService.updateCategory(
      editingCategory.id,
      payload,
    );

    setCategoryDialogOpen(false);
    setEditingCategory(null);

    await loadMenu();
  } catch (error) {
    console.error("Failed to update category:", error);
  } finally {
    setSaving(false);
  }
};

  /*
   * CREATE MENU ITEM
   */

  const handleCreateItem =
    async (
      data: MenuItemFormData,
    ) => {
      if (!restaurantId) {
        console.error(
          "Cannot create menu item: restaurantId is missing.",
        );
        return;
      }

      try {
        setSaving(true);

        const slug =
          data.name
            .toLowerCase()
            .trim()
            .replace(
              /[^a-z0-9\s-]/g,
              "",
            )
            .replace(
              /\s+/g,
              "-",
            )
            .replace(
              /-+/g,
              "-",
            );

        const payload:
          CreateMenuItemData = {
            restaurantId,

            categoryId:
              data.categoryId,

            name:
              data.name.trim(),

            slug,

            description:
              data.description?.trim() ||
              undefined,

            type:
              data.type,

            price:
              data.price,

            discountPrice:
              data.discountPrice,

            image:
              data.image?.trim() ||
              undefined,

            isVegetarian:
              data.isVegetarian,

            isVegan:
              data.isVegan,

            preparationTime:
              data.preparationTime,

            sortOrder:
              data.sortOrder,
          };

        await menuService.createMenuItem(
          payload,
        );

        setItemDialogOpen(false);
        setEditingItem(null);

        await loadMenu();
      } catch (error) {
        console.error(
          "Failed to create menu item:",
          error,
        );
      } finally {
        setSaving(false);
      }
    };

  /*
   * UPDATE MENU ITEM
   */

  const handleUpdateItem =
    async (
      data: MenuItemFormData,
    ) => {
      if (!editingItem) {
        return;
      }

      try {
        setSaving(true);

        const slug =
          data.name
            .toLowerCase()
            .trim()
            .replace(
              /[^a-z0-9\s-]/g,
              "",
            )
            .replace(
              /\s+/g,
              "-",
            )
            .replace(
              /-+/g,
              "-",
            );

        const payload:
          UpdateMenuItemData = {
            categoryId:
              data.categoryId,

            name:
              data.name.trim(),

            slug,

            description:
              data.description?.trim() ||
              undefined,

            type:
              data.type,

            price:
              data.price,

            discountPrice:
              data.discountPrice,

            image:
              data.image?.trim() ||
              undefined,

            isVegetarian:
              data.isVegetarian,

            isVegan:
              data.isVegan,

            preparationTime:
              data.preparationTime,

            sortOrder:
              data.sortOrder,
          };

        await menuService.updateMenuItem(
          editingItem.id,
          payload,
        );

        setItemDialogOpen(false);
        setEditingItem(null);

        await loadMenu();
      } catch (error) {
        console.error(
          "Failed to update menu item:",
          error,
        );
      } finally {
        setSaving(false);
      }
    };

  /*
   * DELETE CATEGORY
   */

  const handleDeleteCategory =
    async (
      category: MenuCategory,
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${category.name}"?`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setSaving(true);

        await menuService.deleteCategory(
          category.id,
        );

        if (
          selectedCategory ===
          category.id
        ) {
          setSelectedCategory("");
        }

        await loadMenu();
      } catch (error) {
        console.error(
          "Failed to delete category:",
          error,
        );
      } finally {
        setSaving(false);
      }
    };

  /*
   * DELETE MENU ITEM
   */

  const handleDeleteItem =
    async (
      item: MenuItem,
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${item.name}"?`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setSaving(true);

        await menuService.deleteMenuItem(
          item.id,
        );

        await loadMenu();
      } catch (error) {
        console.error(
          "Failed to delete menu item:",
          error,
        );
      } finally {
        setSaving(false);
      }
    };

  /*
   * NO RESTAURANT
   */

  if (!restaurantId) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
          <h2 className="text-lg font-semibold text-yellow-800">
            No Restaurant Selected
          </h2>

          <p className="mt-2 text-sm text-yellow-700">
            Your account is not currently
            associated with a restaurant.
            Please select or create a
            restaurant before managing
            the menu.
          </p>
        </div>
      </div>
    );
  }

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="p-6">
        Loading menu...
      </div>
    );
  }

  /*
   * PAGE
   */

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
          disabled={
            categories.length === 0
          }
        >
          <Plus className="mr-2 h-4 w-4" />

          Add Menu Item
        </Button>
      </div>

      {/* STATS */}

      <MenuStats
        stats={stats}
      />

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

        onDelete={
          handleDeleteCategory
        }
      />

      {/* FILTERS */}

      <div className="flex flex-col gap-3 md:flex-row">

        <div className="relative flex-1">

          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />

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

          {categories.map(
            (category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ),
          )}
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

          onDelete={
            handleDeleteItem
          }
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

      {/* MENU ITEM DIALOG */}

      <MenuItemFormDialog
        open={itemDialogOpen}
        item={editingItem}
        categories={categories}
        loading={saving}
        onOpenChange={
          setItemDialogOpen
        }
        onSubmit={
          editingItem
            ? handleUpdateItem
            : handleCreateItem
        }
      />

    </div>
  );
}