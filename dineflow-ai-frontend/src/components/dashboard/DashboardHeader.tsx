import {
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

function DashboardHeader() {
  const { user } = useAuth();

  const name =
    user?.firstName ||
    user?.name ||
    "there";

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-semibold text-[#FF6B35]">
          Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Good morning, {name} 👋
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Here's what's happening with your restaurant today.
        </p>
      </div>

      <button
        type="button"
        className="flex w-fit items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50/40"
      >
        <CalendarDays className="h-4 w-4 text-[#FF6B35]" />

        <span>Today</span>

        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>
    </div>
  );
}

export default DashboardHeader;