import { useCallback, useEffect, useState } from "react";

import {
  getRestaurants,
  updateRestaurantStatus,
} from "@/services/restaurants/restaurant.service";

import type { Restaurant } from "@/types/restaurant.types";

export default function AccountActivation() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadRestaurants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getRestaurants();
      setRestaurants(response.restaurants);
    } catch (err) {
      console.error("Failed to load restaurants:", err);
      setError("Unable to load restaurant accounts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRestaurants();
  }, [loadRestaurants]);

  const handleStatusChange = async (restaurant: Restaurant) => {
    if (!restaurant.id || updatingId !== null) {
      return;
    }

    const currentlyActive = restaurant.status === "ACTIVE";
    const nextIsActive = !currentlyActive;

    try {
      setUpdatingId(restaurant.id);
      setError(null);
      setSuccess(null);

      // Wait for the backend to confirm the status change.
      const updated = await updateRestaurantStatus(
        restaurant.id,
        nextIsActive,
      );

      // Use the normalized backend response when it includes this restaurant.
      // The requested ID is used for matching so the UI does not depend on
      // the response using "id" rather than MongoDB's "_id".
      setRestaurants((current) =>
        current.map((item) => {
          if (item.id !== restaurant.id) {
            return item;
          }

          return {
            ...item,
            ...updated,
            id: updated.id || item.id,
            status: nextIsActive ? "ACTIVE" : "INACTIVE",
          };
        }),
      );

      setSuccess(
        `${restaurant.name} has been ${
          nextIsActive ? "activated" : "deactivated"
        }.`,
      );
    } catch (err) {
      console.error("Failed to change restaurant status:", err);

      setError(
        `Unable to ${
          nextIsActive ? "activate" : "deactivate"
        } ${restaurant.name}. Please try again.`,
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading restaurant accounts...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Account Activation
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Activate or deactivate restaurant access.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={() => void loadRestaurants()}
            className="mt-2 font-semibold underline"
          >
            Reload accounts
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          {success}
        </div>
      )}

      <div className="space-y-4">
        {restaurants.length === 0 ? (
          <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
            No restaurants found.
          </div>
        ) : (
          restaurants.map((restaurant) => {
            const isUpdating = updatingId === restaurant.id;
            const isActive = restaurant.status === "ACTIVE";

            return (
              <div
                key={restaurant.id}
                className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h2 className="font-medium">
                    {restaurant.name}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {restaurant.email ?? "No email"}
                  </p>

                  <p className="mt-1 text-xs">
                    Status:{" "}
                    <span
                      className={
                        isActive
                          ? "font-semibold text-green-700"
                          : "font-semibold text-red-700"
                      }
                    >
                      {restaurant.status}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isUpdating || updatingId !== null}
                  onClick={() => void handleStatusChange(restaurant)}
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
          })
        )}
      </div>
    </div>
  );
}

