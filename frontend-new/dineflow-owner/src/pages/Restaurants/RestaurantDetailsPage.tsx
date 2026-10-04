import {
  ArrowLeft,
  Pencil,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import RestaurantDetails from "@/components/restaurants/RestaurantDetails";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";

import {
  getRestaurantById,
} from "@/services/restaurants/restaurant.service";

import type {
  Restaurant,
} from "@/types/restaurant.types";

function RestaurantDetailsPage() {
  const { id } =
    useParams<{
      id: string;
    }>();

  const navigate =
    useNavigate();

  const [
    restaurant,
    setRestaurant,
  ] = useState<Restaurant | null>(
    null,
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    const loadRestaurant =
      async () => {
        if (
          !id ||
          id === "undefined"
        ) {
          setError(true);
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError(false);

          const data =
            await getRestaurantById(
              id,
            );

          setRestaurant(data);
        } catch (err) {
          console.error(
            "Failed to load restaurant:",
            err,
          );

          setError(true);
          setRestaurant(null);
        } finally {
          setLoading(false);
        }
      };

    void loadRestaurant();
  }, [id]);

  if (loading) {
    return (
      <LoadingState message="Loading restaurant..." />
    );
  }

  if (
    error ||
    !restaurant
  ) {
    return (
      <ErrorState
        title="Restaurant not found"
        description="We couldn't load this restaurant."
        action={
          <button
            type="button"
            onClick={() =>
              navigate(
                "/restaurants",
              )
            }
            className="rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Restaurants
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/restaurants",
            )
          }
          className="flex w-fit items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#FF6B35]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Restaurants
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/restaurants/${restaurant.id}/edit`,
            )
          }
          className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#FF6B35]"
        >
          <Pencil className="h-4 w-4" />
          Edit Restaurant
        </button>

      </div>

      <RestaurantDetails
        restaurant={
          restaurant
        }
      />

    </div>
  );
}

export default RestaurantDetailsPage;