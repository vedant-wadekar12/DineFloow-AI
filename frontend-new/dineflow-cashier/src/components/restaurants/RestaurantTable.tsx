import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  Restaurant,
} from "@/types/restaurant.types";

import RestaurantStatusBadge from "./RestaurantStatusBadge";

interface RestaurantTableProps {
  restaurants: Restaurant[];
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

function RestaurantTable({
  restaurants,
  onView,
  onEdit,
  onDelete,
}: RestaurantTableProps) {
  const [
    openMenuId,
    setOpenMenuId,
  ] = useState<string | null>(
    null,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">

          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Restaurant
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Location
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Contact
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {restaurants.map(
              (restaurant) => (
                <tr
                  key={restaurant.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60"
                >

                  {/* RESTAURANT */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50">

                        {restaurant.logo ? (
                          <img
                            src={
                              restaurant.logo
                            }
                            alt={
                              restaurant.name
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-[#FF6B35]">
                            {restaurant.name
                              .slice(
                                0,
                                2,
                              )
                              .toUpperCase()}
                          </span>
                        )}

                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-gray-900">
                          {restaurant.name}
                        </p>

                        <p className="truncate text-xs text-gray-400">
                          /{restaurant.slug}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* LOCATION */}

                  <td className="px-6 py-4">

                    <p className="text-sm text-gray-700">
                      {restaurant.city ||
                        "—"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {restaurant.state ||
                        ""}
                    </p>

                  </td>

                  {/* CONTACT */}

                  <td className="px-6 py-4">

                    <p className="text-sm text-gray-700">
                      {restaurant.email ||
                        "—"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {restaurant.phone ||
                        ""}
                    </p>

                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-4">

                    <RestaurantStatusBadge
                      status={
                        restaurant.status
                      }
                    />

                  </td>

                  {/* ACTIONS */}

                  <td className="px-6 py-4">

                    <div className="relative flex items-center justify-end gap-1">

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(
                            null,
                          );

                          onView(
                            restaurant,
                          );
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(
                            null,
                          );

                          onEdit(
                            restaurant,
                          );
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-orange-50 hover:text-[#FF6B35]"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(
                            null,
                          );

                          onDelete(
                            restaurant,
                          );
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      {/* THREE DOT */}

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(
                            (current) =>
                              current ===
                              restaurant.id
                                ? null
                                : restaurant.id,
                          );
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        title="More actions"
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {/* MENU */}

                      {openMenuId ===
                        restaurant.id && (
                        <div className="absolute right-0 top-11 z-50 w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(
                                null,
                              );

                              onView(
                                restaurant,
                              );
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(
                                null,
                              );

                              onEdit(
                                restaurant,
                              );
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6B35]"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(
                                null,
                              );

                              onDelete(
                                restaurant,
                              );
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>

                        </div>
                      )}

                    </div>

                  </td>

                </tr>
              ),
            )}

          </tbody>

        </table>
      </div>
    </div>
  );
}

export default RestaurantTable;