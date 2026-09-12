import {
  ArrowLeft,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import RestaurantForm, {
  type RestaurantFormValues,
} from "@/components/restaurants/RestaurantForm";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";

import {
  getRestaurantById,
  updateRestaurant,
} from "@/services/restaurants/restaurant.service";

import type {
  Restaurant,
} from "@/types/restaurant.types";

function EditRestaurantPage() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response =
          await getRestaurantById(id);

        const data =
          (response as any)?.data ??
          response;

        setRestaurant(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (
    data: RestaurantFormValues,
  ) => {
    if (!id) {
      return;
    }

    await updateRestaurant(
      id,
      data,
    );

    navigate(
      `/restaurants/${id}`,
      { replace: true },
    );
  };

  if (loading) {
    return (
      <LoadingState message="Loading restaurant..." />
    );
  }

  if (error || !restaurant) {
    return (
      <ErrorState
        title="Unable to load restaurant"
        description="This restaurant could not be found."
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        type="button"
        onClick={() =>
          navigate(
            `/restaurants/${id}`,
          )
        }
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#FF6B35]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Restaurant
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#FF6B35]">
            Restaurant Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Edit Restaurant
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update the information for{" "}
            {restaurant.name}.
          </p>
        </div>

        <RestaurantForm
          restaurant={restaurant}
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate(
              `/restaurants/${id}`,
            )
          }
        />
      </div>
    </div>
  );
}

export default EditRestaurantPage;