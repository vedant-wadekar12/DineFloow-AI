import { Plus, Store } from "lucide-react";

interface RestaurantHeaderProps {
  onCreate: () => void;
}

function RestaurantHeader({
  onCreate,
}: RestaurantHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
            <Store className="h-4 w-4 text-[#FF6B35]" />
          </div>

          <p className="text-sm font-semibold text-[#FF6B35]">
            Management
          </p>
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Restaurants
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your restaurant locations and business information.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FF6B35] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e85a27] hover:shadow-md"
      >
        <Plus className="h-4 w-4" />
        Add Restaurant
      </button>
    </div>
  );
}

export default RestaurantHeader;