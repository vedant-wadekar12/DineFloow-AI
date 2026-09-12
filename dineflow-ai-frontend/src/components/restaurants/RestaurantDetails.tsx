import {
  Building2,
  CalendarDays,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Store,
} from "lucide-react";

import type {
  Restaurant,
} from "@/types/restaurant.types";

import RestaurantStatusBadge from "./RestaurantStatusBadge";

interface RestaurantDetailsProps {
  restaurant: Restaurant;
}

function RestaurantDetails({
  restaurant,
}: RestaurantDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Main profile */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-32 bg-gradient-to-r from-orange-50 via-amber-50 to-white" />

        <div className="px-5 pb-6 sm:px-6">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-orange-50 shadow-sm">
                {restaurant.logo ? (
                  <img
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store className="h-8 w-8 text-[#FF6B35]" />
                )}
              </div>

              <div className="pb-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {restaurant.name}
                </h1>

                <p className="mt-1 text-sm text-gray-400">
                  /{restaurant.slug}
                </p>
              </div>
            </div>

            <RestaurantStatusBadge
              status={restaurant.status}
            />
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard title="Contact Information">
          <InfoRow
            icon={Mail}
            label="Email"
            value={
              restaurant.email || "Not provided"
            }
          />

          <InfoRow
            icon={Phone}
            label="Phone"
            value={
              restaurant.phone || "Not provided"
            }
          />
        </InfoCard>

        <InfoCard title="Location">
          <InfoRow
            icon={MapPin}
            label="Address"
            value={
              restaurant.address || "Not provided"
            }
          />

          <InfoRow
            icon={Building2}
            label="City / State"
            value={[
              restaurant.city,
              restaurant.state,
            ]
              .filter(Boolean)
              .join(", ") ||
              "Not provided"}
          />
        </InfoCard>

        <InfoCard title="Regional Settings">
          <InfoRow
            icon={Globe2}
            label="Currency"
            value={
              restaurant.currency || "INR"
            }
          />

          <InfoRow
            icon={Globe2}
            label="Timezone"
            value={
              restaurant.timezone ||
              "Asia/Kolkata"
            }
          />
        </InfoCard>

        <InfoCard title="Restaurant Information">
          <InfoRow
            icon={CalendarDays}
            label="Created"
            value={
              restaurant.createdAt
                ? new Date(
                    restaurant.createdAt,
                  ).toLocaleDateString(
                    "en-IN",
                  )
                : "Not available"
            }
          />

          <InfoRow
            icon={Building2}
            label="Restaurant ID"
            value={restaurant.id}
          />
        </InfoCard>
      </div>

      {/* Description */}
      {restaurant.description && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            About the Restaurant
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {restaurant.description}
          </p>
        </div>
      )}
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-gray-900">
        {title}
      </h2>

      <div className="mt-5 space-y-4">
        {children}
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
        <Icon className="h-4 w-4 text-gray-500" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 break-words text-sm font-medium text-gray-700">
          {value}
        </p>
      </div>
    </div>
  );
}

export default RestaurantDetails;