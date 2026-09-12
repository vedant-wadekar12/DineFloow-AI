import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/utils/permission.utils";

import RestaurantHeader from "@/components/restaurants/RestaurantHeader";
import RestaurantFilters from "@/components/restaurants/RestaurantFilters";
import RestaurantTable from "@/components/restaurants/RestaurantTable";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import RestaurantDialog from "@/components/restaurants/RestaurantDialog";
import DeleteRestaurantDialog from "@/components/restaurants/DeleteRestaurantDialog";

import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import {
  createRestaurant,
  deleteRestaurant,
  getRestaurants,
  updateRestaurant,
} from "@/services/restaurants/restaurant.service";

import type {
  Restaurant,
  RestaurantStatus,
} from "@/types/restaurant.types";

import type {
  RestaurantFormValues,
} from "@/components/restaurants/RestaurantForm";

function Restaurants() {
  const navigate = useNavigate();

  // ==========================================
  // AUTHORIZATION
  // ==========================================

  const { user } = useAuth();

  const canCreate = hasPermission(
    user,
    "restaurant:create",
  );

  const canUpdate = hasPermission(
    user,
    "restaurant:update",
  );

  const canDelete = hasPermission(
    user,
    "restaurant:delete",
  );

  // ==========================================
  // STATE
  // ==========================================

  const [
    restaurants,
    setRestaurants,
  ] = useState<Restaurant[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<RestaurantStatus | "ALL">(
      "ALL",
    );

  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  const [
    selectedRestaurant,
    setSelectedRestaurant,
  ] = useState<Restaurant | null>(
    null,
  );

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    restaurantToDelete,
    setRestaurantToDelete,
  ] = useState<Restaurant | null>(
    null,
  );

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState(false);

  // ==========================================
  // LOAD RESTAURANTS
  // ==========================================

  const loadRestaurants =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(false);

        const response =
          await getRestaurants();

        const data =
          (response as any)?.data ??
          response;

        const restaurantList =
          Array.isArray(data)
            ? data
            : data.restaurants ?? [];

        setRestaurants(
          restaurantList,
        );
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  // ==========================================
  // FILTERING
  // ==========================================

  const filteredRestaurants =
    useMemo(() => {
      return restaurants.filter(
        (restaurant) => {
          const searchText =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            !searchText ||
            restaurant.name
              .toLowerCase()
              .includes(searchText) ||
            restaurant.slug
              .toLowerCase()
              .includes(searchText) ||
            restaurant.city
              ?.toLowerCase()
              .includes(searchText);

          const matchesStatus =
            status === "ALL" ||
            restaurant.status === status;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      restaurants,
      search,
      status,
    ]);

  // ==========================================
  // CREATE
  // ==========================================

  const handleCreate = () => {
    if (!canCreate) {
      return;
    }

    setSelectedRestaurant(null);
    setDialogOpen(true);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (
    restaurant: Restaurant,
  ) => {
    if (!canUpdate) {
      return;
    }

    setSelectedRestaurant(
      restaurant,
    );

    setDialogOpen(true);
  };

  // ==========================================
  // VIEW
  // ==========================================

  const handleView = (
    restaurant: Restaurant,
  ) => {
    navigate(
      `/restaurants/${restaurant.id}`,
    );
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = (
    restaurant: Restaurant,
  ) => {
    if (!canDelete) {
      return;
    }

    setRestaurantToDelete(
      restaurant,
    );

    setDeleteDialogOpen(true);
  };

  // ==========================================
  // CREATE / UPDATE SUBMIT
  // ==========================================

  const handleSubmit = async (
    data: RestaurantFormValues,
  ) => {
    if (selectedRestaurant) {
      if (!canUpdate) {
        return;
      }

      const updated =
        await updateRestaurant(
          selectedRestaurant.id,
          data,
        );

      const normalized =
        (updated as any)?.data ??
        updated;

      setRestaurants(
        (current) =>
          current.map(
            (restaurant) =>
              restaurant.id ===
              selectedRestaurant.id
                ? normalized
                : restaurant,
          ),
      );
    } else {
      if (!canCreate) {
        return;
      }

      const created =
        await createRestaurant(
          data,
        );

      const normalized =
        (created as any)?.data ??
        created;

      setRestaurants(
        (current) => [
          normalized,
          ...current,
        ],
      );
    }

    setDialogOpen(false);
    setSelectedRestaurant(null);
  };

  // ==========================================
  // DELETE CONFIRM
  // ==========================================

  const handleDeleteConfirm =
    async () => {
      if (!restaurantToDelete) {
        return;
      }

      if (!canDelete) {
        return;
      }

      try {
        setDeleteLoading(true);

        await deleteRestaurant(
          restaurantToDelete.id,
        );

        setRestaurants(
          (current) =>
            current.filter(
              (restaurant) =>
                restaurant.id !==
                restaurantToDelete.id,
            ),
        );

        setDeleteDialogOpen(false);
        setRestaurantToDelete(null);
      } finally {
        setDeleteLoading(false);
      }
    };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <LoadingState message="Loading restaurants..." />
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <ErrorState
        title="Unable to load restaurants"
        description="We couldn't retrieve your restaurants. Please try again."
        action={
          <button
            type="button"
            onClick={loadRestaurants}
            className="rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        }
      />
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <RestaurantHeader
  onCreate={handleCreate}
/>

      {/* FILTERS */}
      <RestaurantFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onClear={() => {
          setSearch("");
          setStatus("ALL");
        }}
      />

        <div className="flex items-center justify-between">
  <p className="text-sm text-gray-500">
    Showing{" "}
    <span className="font-semibold text-gray-900">
      {filteredRestaurants.length}
    </span>{" "}
    of{" "}
    <span className="font-semibold text-gray-900">
      {restaurants.length}
    </span>{" "}
    restaurants
  </p>
</div>

      {/* EMPTY / RESTAURANT LIST */}
      {filteredRestaurants.length ===
      0 ? (
        <EmptyState
          title={
            restaurants.length === 0
              ? "No restaurants yet"
              : "No restaurants found"
          }
          description={
            restaurants.length === 0
              ? "Create your first restaurant to start managing your DineFlow workspace."
              : "Try changing your search or filters."
          }
          action={
            restaurants.length ===
              0 &&
            canCreate && (
              <button
                type="button"
                onClick={handleCreate}
                className="rounded-xl bg-[#FF6B35] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Add Restaurant
              </button>
            )
          }
        />
      ) : (
        <>
          {/* DESKTOP */}
          <div className="hidden lg:block">
            <RestaurantTable
              restaurants={
                filteredRestaurants
              }
              onView={handleView}
              onEdit={handleEdit}
onDelete={handleDelete}
            />
          </div>

          {/* MOBILE / TABLET */}
          <div className="grid gap-4 lg:hidden">
            {filteredRestaurants.map(
              (restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={
                    restaurant
                  }
                  onView={handleView}
                  onEdit={handleEdit}
onDelete={handleDelete}
                />
              ),
            )}
          </div>
        </>
      )}

      {/* CREATE / UPDATE DIALOG */}
      <RestaurantDialog
        open={dialogOpen}
        restaurant={
          selectedRestaurant
        }
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
      />

      {/* DELETE DIALOG */}
      <DeleteRestaurantDialog
        open={deleteDialogOpen}
        restaurant={
          restaurantToDelete
        }
        loading={deleteLoading}
        onOpenChange={
          setDeleteDialogOpen
        }
        onConfirm={
          handleDeleteConfirm
        }
      />
    </div>
  );
}

export default Restaurants;