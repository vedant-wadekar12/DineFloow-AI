import { useEffect, useState } from "react";

import {
  getRestaurants,
  updateRestaurantStatus,
} from "@/services/restaurants/restaurant.service";

import type { Restaurant } from "@/types/restaurant.types";

export default function RestaurantAccounts() {
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response =
        await getRestaurants();

      setRestaurants(
        response.restaurants,
      );
    } catch (err) {
      console.error(
        "Failed to load restaurant accounts:",
        err,
      );

      setError(
        "Unable to load restaurant accounts.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRestaurants();
  }, []);

  const handleStatusChange = async (
  restaurant: Restaurant,
  isActive: boolean,
) => {
  try {
    setUpdatingId(restaurant.id);
    setError(null);

    const updated = await updateRestaurantStatus(
      restaurant.id,
      isActive,
    );

    setRestaurants((current) =>
      current.map((item) =>
        item.id === updated.id ? updated : item,
      ),
    );
  } catch (error) {
    console.error(
      "Failed to update restaurant status:",
      error,
    );

    setError(
      `Unable to change ${restaurant.name}'s account status.`,
    );
  } finally {
    setUpdatingId(null);
  }
};

  if (isLoading) {
    return (
      <div className="p-6">
        Loading restaurant accounts...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Restaurant Accounts
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage restaurant account access.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {restaurants.map((restaurant) => {
          const isUpdating =
            updatingId === restaurant.id;

          const isActive =
            restaurant.status === "ACTIVE";

          return (
            <div
              key={restaurant.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <h2 className="font-medium">
                  {restaurant.name}
                </h2>

                <p className="text-sm text-muted-foreground">
                  {restaurant.email ??
                    "No email"}
                </p>

                <p className="mt-1 text-xs">
                  Status:{" "}
                  <span className="font-medium">
                    {restaurant.status}
                  </span>
                </p>
              </div>

              <button
                type="button"
                disabled={isUpdating}
                onClick={() =>
                  handleStatusChange(
                    restaurant,
                    !isActive,
                  )
                }
                className="rounded-md border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdating
                  ? "Updating..."
                  : isActive
                    ? "Deactivate"
                    : "Activate"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}