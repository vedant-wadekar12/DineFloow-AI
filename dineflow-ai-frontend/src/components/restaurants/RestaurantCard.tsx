import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import type {
  Restaurant,
} from "@/types/restaurant.types";

import RestaurantStatusBadge from "./RestaurantStatusBadge";

interface RestaurantCardProps {
  restaurant: Restaurant;

  onView: (
    restaurant: Restaurant,
  ) => void;

  onEdit: (
    restaurant: Restaurant,
  ) => void;

  onDelete: (
    restaurant: Restaurant,
  ) => void;
}

function RestaurantCard({
  restaurant,
  onView,
  onEdit,
  onDelete,
}: RestaurantCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

      <div className="flex items-start gap-3">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50">

          {restaurant.logo ? (
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-bold text-[#FF6B35]">
              {restaurant.name
                .slice(0, 2)
                .toUpperCase()}
            </span>
          )}

        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">

              <h3 className="truncate font-semibold text-gray-900">
                {restaurant.name}
              </h3>

              <p className="truncate text-xs text-gray-400">
                /{restaurant.slug}
              </p>

            </div>

            <RestaurantStatusBadge
              status={
                restaurant.status
              }
            />

          </div>

        </div>

      </div>

      <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">

        <div className="flex justify-between gap-4">

          <span className="text-xs text-gray-400">
            Location
          </span>

          <span className="text-right text-sm text-gray-700">
            {restaurant.city ||
              "—"}

            {restaurant.state
              ? `, ${restaurant.state}`
              : ""}
          </span>

        </div>

        <div className="flex justify-between gap-4">

          <span className="text-xs text-gray-400">
            Email
          </span>

          <span className="truncate text-right text-sm text-gray-700">
            {restaurant.email ||
              "—"}
          </span>

        </div>

      </div>

      <div className="mt-4 flex gap-2">

        {/* VIEW */}

        <button
          type="button"
          onClick={() =>
            onView(restaurant)
          }
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <Eye className="h-4 w-4" />
          View
        </button>

        {/* EDIT */}

        <button
          type="button"
          onClick={() =>
            onEdit(restaurant)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-orange-200 hover:bg-orange-50 hover:text-[#FF6B35]"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>

        {/* DELETE */}

        <button
          type="button"
          onClick={() =>
            onDelete(restaurant)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>

      </div>

    </div>
  );
}

export default RestaurantCard;