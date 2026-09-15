import {
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import {
  useState,
} from "react";

import { useAuth } from "@/hooks/useAuth";

function DashboardHeader() {
  const { user } = useAuth();

  const name =
    user?.firstName ||
    user?.name ||
    "there";

  const [
    showDateMenu,
    setShowDateMenu,
  ] = useState(false);

  const [
    selectedDate,
    setSelectedDate,
  ] = useState("Today");

  const handleDateChange = (
    value: string,
  ) => {
    setSelectedDate(value);
    setShowDateMenu(false);
  };

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

      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setShowDateMenu(
              (current) => !current,
            )
          }
          className="flex w-fit items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50/40"
        >
          <CalendarDays className="h-4 w-4 text-[#FF6B35]" />

          <span>
            {selectedDate}
          </span>

          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {showDateMenu && (
          <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
            <button
              type="button"
              onClick={() =>
                handleDateChange(
                  "Today",
                )
              }
              className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() =>
                handleDateChange(
                  "Yesterday",
                )
              }
              className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              Yesterday
            </button>

            <button
              type="button"
              onClick={() =>
                handleDateChange(
                  "Last 7 days",
                )
              }
              className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              Last 7 days
            </button>

            <button
              type="button"
              onClick={() =>
                handleDateChange(
                  "This month",
                )
              }
              className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              This month
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardHeader;