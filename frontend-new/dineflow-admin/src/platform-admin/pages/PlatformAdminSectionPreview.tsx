import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  ShieldCheck,
  Users,
  ScrollText,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getRestaurants,
  updateRestaurantStatus,
} from "@/services/restaurants/restaurant.service";

import type {
  Restaurant,
  RestaurantStatus,
} from "@/types/restaurant.types";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";

type Kind =
  | "accounts"
  | "subscriptions"
  | "access"
  | "audit";

const meta: Record<
  Kind,
  {
    eyebrow: string;
    title: string;
    description: string;
    icon: typeof Building2;
  }
> = {
  accounts: {
    eyebrow: "Restaurant accounts",
    title: "Restaurant account control",
    description:
      "Real restaurant records and the documented account-status mutation. No demo accounts are included.",
    icon: Building2,
  },

  subscriptions: {
    eyebrow: "Subscription review",
    title: "Subscription & payment review",
    description:
      "This area will only show subscription/payment records after a documented backend contract is supplied.",
    icon: CreditCard,
  },

  access: {
    eyebrow: "Access control",
    title: "Access & permissions",
    description:
      "This area will only mutate permissions through a documented backend contract. The frontend never invents permission endpoints.",
    icon: Users,
  },

  audit: {
    eyebrow: "Audit & controls",
    title: "Platform audit log",
    description:
      "This area will only display audit events returned by a documented backend audit endpoint.",
    icon: ScrollText,
  },
};

export default function PlatformAdminSectionPreview({
  kind,
}: {
  kind: Kind;
}) {
  const item = meta[kind];
  const Icon = item.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#FF6B35]">
            {item.eyebrow}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            {item.title}
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {item.description}
          </p>
        </div>

        <Link
          to="/preview"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-orange-200 hover:text-[#FF6B35]"
        >
          <ArrowLeft className="h-4 w-4" />
          Overview
        </Link>
      </div>

      {kind === "accounts" ? (
        <AccountControl />
      ) : (
        <ContractOnly kind={kind} icon={Icon} />
      )}
    </div>
  );
}

function AccountControl() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [updating, setUpdating] = useState<string | null>(null);

  const [pending, setPending] = useState<{
    restaurant: Restaurant;
    status: RestaurantStatus;
  } | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getRestaurants();

      setRestaurants(response.restaurants);
    } catch (err) {
      console.error(
        "Failed to load restaurant accounts:",
        err,
      );

      setError(
        "Unable to load restaurant accounts from the backend.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const changeStatus = async () => {
    if (!pending) {
      return;
    }

    const restaurant = pending.restaurant;
    const requestedStatus = pending.status;

    /*
     * The currently documented backend endpoint accepts:
     *
     * PATCH /restaurants/:id/status
     *
     * {
     *   isActive: boolean
     * }
     *
     * Therefore:
     *
     * ACTIVE   -> true
     * INACTIVE -> false
     *
     * We do NOT send SUSPENDED because the verified endpoint
     * does not currently document a separate suspension mutation.
     */
    const isActive = requestedStatus === "ACTIVE";

    try {
      setUpdating(restaurant.id);
      setError(null);

      const updated = await updateRestaurantStatus(
        restaurant.id,
        isActive,
      );

      setRestaurants((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      );

      setPending(null);
    } catch (err) {
      console.error(
        "Failed to change restaurant status:",
        err,
      );

      setError(
        `Unable to change ${restaurant.name}'s status.`,
      );
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <LoadingState message="Loading real restaurant accounts..." />
    );
  }

  if (error && restaurants.length === 0) {
    return (
      <ErrorState
        title="Restaurant accounts unavailable"
        description={error}
        action={
          <Button onClick={() => void load()}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <strong>Real-data control:</strong>{" "}
        status changes call the existing restaurant status API.
        The frontend does not simulate access revocation.
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-bold text-slate-950">
            Restaurant accounts
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {restaurants.length} record(s) returned by the
            backend.
          </p>
        </div>

        {restaurants.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No restaurant accounts were returned.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-5 py-3">
                    Restaurant
                  </th>

                  <th className="px-5 py-3">
                    Owner ID
                  </th>

                  <th className="px-5 py-3">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right">
                    Real backend action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {restaurants.map((restaurant) => {
                  const isActive =
                    restaurant.status === "ACTIVE";

                  const isUpdating =
                    updating === restaurant.id;

                  return (
                    <tr key={restaurant.id}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {restaurant.name ||
                            "Unnamed restaurant"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {restaurant.slug ||
                            restaurant.id}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {restaurant.ownerId ?? "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            isActive
                              ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                              : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                          }
                        >
                          {restaurant.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {isActive ? (
                            /*
                             * ACTIVE restaurant
                             *
                             * Real backend request:
                             * {
                             *   isActive: false
                             * }
                             */
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isUpdating}
                              onClick={() =>
                                setPending({
                                  restaurant,
                                  status: "INACTIVE",
                                })
                              }
                            >
                              {isUpdating
                                ? "Updating..."
                                : "Deactivate"}
                            </Button>
                          ) : (
                            /*
                             * INACTIVE restaurant
                             *
                             * Real backend request:
                             * {
                             *   isActive: true
                             * }
                             */
                            <Button
                              size="sm"
                              disabled={isUpdating}
                              onClick={() =>
                                setPending({
                                  restaurant,
                                  status: "ACTIVE",
                                })
                              }
                            >
                              {isUpdating
                                ? "Updating..."
                                : "Activate"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pending)}
        onOpenChange={(open) => {
          if (!open && !updating) {
            setPending(null);
          }
        }}
        title={
          pending?.status === "INACTIVE"
            ? "Deactivate restaurant?"
            : "Activate restaurant?"
        }
        description={
          pending
            ? pending.status === "INACTIVE"
              ? `This will deactivate ${pending.restaurant.name}. The existing backend status API will receive isActive: false.`
              : `This will activate ${pending.restaurant.name}. The existing backend status API will receive isActive: true.`
            : ""
        }
        onConfirm={() => void changeStatus()}
        loading={Boolean(updating)}
      />
    </>
  );
}

function ContractOnly({
  kind,
  icon: Icon,
}: {
  kind: Exclude<Kind, "accounts">;
  icon: typeof Building2;
}) {
  const details = {
    subscriptions: {
      feature:
        "Subscription review and payment/hold control",

      contract:
        "Frontend API contract required: subscription/payment list + payment review/approval + restaurant hold/suspension contract",

      reason:
        "No documented frontend contract currently defines the subscription/payment response shape or the mutation that declines unpaid access.",
    },

    access: {
      feature:
        "Access & permissions administration",

      contract:
        "Frontend API contract required: platform user/role/permission list + grant/revoke endpoint + request/response",

      reason:
        "No documented frontend contract currently defines platform permission administration. The UI must not invent it.",
    },

    audit: {
      feature:
        "Audit & controls",

      contract:
        "Frontend API contract required: audit log list endpoint + pagination/filter/query parameters + response shape",

      reason:
        "No documented frontend audit endpoint or event response shape is available in the supplied frontend contract.",
    },
  }[kind];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600">
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-bold text-amber-950">
              Real-data contract required
            </h2>

            <p className="mt-2 text-sm leading-6 text-amber-900">
              {details.reason}
            </p>

            <p className="mt-3 rounded-lg bg-white/70 p-3 font-mono text-xs text-amber-900">
              {details.contract}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-950">
          Why this is not a fake page
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          The page intentionally contains no sample counts,
          restaurant names, payment amounts, permission totals,
          or audit events. Once the documented API contract is
          provided, this surface can be connected without
          changing the security boundary.
        </p>

        <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <ShieldCheck className="h-5 w-5 text-[#FF6B35]" />
          Backend authorization remains the authority for every
          action.
        </div>
      </div>
    </div>
  );
}