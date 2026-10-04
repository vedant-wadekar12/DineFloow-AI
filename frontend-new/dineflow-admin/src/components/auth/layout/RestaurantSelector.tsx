import {
  Check,
  ChevronDown,
  Store,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRestaurant } from "@/context/RestaurantContext";

function RestaurantSelector() {
  const {
    restaurants,
    selectedRestaurant,
    selectedRestaurantId,
    isLoading,
    setSelectedRestaurantId,
  } = useRestaurant();

  const restaurantName =
    selectedRestaurant?.name ??
    "Select Restaurant";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-left transition hover:border-orange-200 hover:bg-orange-50/40"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100">
          <Store className="h-4 w-4 text-[#FF6B35]" />
        </div>

        <div className="hidden min-w-0 md:block">
          <p className="truncate text-xs text-gray-500">
            Restaurant
          </p>

          <p className="max-w-[150px] truncate text-sm font-semibold text-gray-900">
            {isLoading
              ? "Loading..."
              : restaurantName}
          </p>
        </div>

        <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64"
      >
        {restaurants.length === 0 ? (
          <DropdownMenuItem disabled>
            No restaurants available
          </DropdownMenuItem>
        ) : (
          restaurants.map((restaurant) => (
            <DropdownMenuItem
              key={restaurant.id}
              onClick={() =>
                setSelectedRestaurantId(
                  restaurant.id,
                )
              }
              className="flex cursor-pointer items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {restaurant.name}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {restaurant.slug}
                </p>
              </div>

              {selectedRestaurantId ===
                restaurant.id && (
                <Check className="h-4 w-4 shrink-0 text-[#FF6B35]" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default RestaurantSelector;