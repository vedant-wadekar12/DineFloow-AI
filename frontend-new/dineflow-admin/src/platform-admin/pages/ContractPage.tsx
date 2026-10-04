import { useEffect, useState, type FormEvent } from "react";
import {
  ShieldAlert,
  ScrollText,
  RefreshCw,
  Search,
  CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  checkRestaurantSubscriptionStatus,
  getSubscriptionPlans,
  type RestaurantSubscription,
  type SubscriptionPlan,
} from "@/services/subscriptions/subscription.service";

import { getRestaurants } from "@/services/restaurants/restaurant.service";
import type { Restaurant } from "@/types/restaurant.types";

import {
  assignPermissionToRole,
  getPermissions,
  getRolePermissions,
  type Permission,
} from "@/services/permissions/permission.service";

interface ContractPageProps {
  kind: "subscriptions" | "access";
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as {
        response?: { data?: { message?: string; error?: string } };
      }
    ).response;

    if (response?.data?.message) return response.data.message;
    if (response?.data?.error) return response.data.error;
  }

  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

function formatPrice(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value?: string): string {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700",
    TRIAL: "bg-blue-50 text-blue-700",
    PAST_DUE: "bg-amber-50 text-amber-800",
    CANCELLED: "bg-red-50 text-red-700",
    EXPIRED: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function SubscriptionContent() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState("");

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [restaurantsError, setRestaurantsError] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  const [subscription, setSubscription] =
    useState<RestaurantSubscription | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  async function loadRestaurants() {
    setRestaurantsLoading(true);
    setRestaurantsError("");

    try {
      const result = await getRestaurants();
      setRestaurants(result.restaurants);

      // Clear a selection that no longer exists in the latest API response.
      setRestaurantId((current) =>
        result.restaurants.some((restaurant) => restaurant.id === current)
          ? current
          : "",
      );
    } catch (error) {
      setRestaurantsError(getErrorMessage(error));
    } finally {
      setRestaurantsLoading(false);
    }
  }

  async function loadPlans() {
    setPlansLoading(true);
    setPlansError("");

    try {
      const result = await getSubscriptionPlans();
      setPlans(result);
    } catch (error) {
      setPlansError(getErrorMessage(error));
    } finally {
      setPlansLoading(false);
    }
  }

  useEffect(() => {
    void loadPlans();
    void loadRestaurants();
  }, []);

  async function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = restaurantId.trim();

    if (!id) {
      setLookupError("Select a restaurant first.");
      setSubscription(null);
      return;
    }

    setLookupLoading(true);
    setLookupError("");
    setSubscription(null);

    try {
      const result = await checkRestaurantSubscriptionStatus(id);
      setSubscription(result);
    } catch (error) {
      setLookupError(getErrorMessage(error));
    } finally {
      setLookupLoading(false);
    }
  }

  const plan = subscription
    ? typeof subscription.planId === "object"
      ? subscription.planId
      : plans.find((item) => item._id === subscription.planId)
    : undefined;

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === restaurantId,
  );

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Restaurant subscription lookup
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a restaurant to retrieve the subscription status stored by
              the backend.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void loadRestaurants()}
              disabled={restaurantsLoading}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  restaurantsLoading ? "animate-spin" : ""
                }`}
              />
              Refresh restaurants
            </button>

            <button
              type="button"
              onClick={() => void loadPlans()}
              disabled={plansLoading}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${plansLoading ? "animate-spin" : ""}`}
              />
              Refresh plans
            </button>
          </div>
        </div>

        <form onSubmit={handleLookup} className="mt-5 space-y-3">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="subscription-restaurant-id"
            >
              Select restaurant
            </label>

            <select
              id="subscription-restaurant-id"
              value={restaurantId}
              onChange={(event) => {
                setRestaurantId(event.target.value);
                setSubscription(null);
                setLookupError("");
              }}
              disabled={restaurantsLoading || restaurants.length === 0}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="">
                {restaurantsLoading
                  ? "Loading restaurants..."
                  : restaurants.length === 0
                    ? "No restaurants available"
                    : "Choose a restaurant"}
              </option>

              {restaurants.map((restaurant) => (
                <option
                  key={restaurant.id}
                  value={restaurant.id}
                  disabled={!restaurant.id}
                >
                  {restaurant.name || "Unnamed restaurant"}
                  {restaurant.city ? ` — ${restaurant.city}` : ""}
                  {restaurant.id ? ` (${restaurant.id})` : ""}
                </option>
              ))}
            </select>
          </div>

          {selectedRestaurant && (
            <p className="break-all text-xs text-slate-500">
              Selected restaurant ID: {selectedRestaurant.id}
            </p>
          )}

          {restaurantsError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <p>{restaurantsError}</p>
              <button
                type="button"
                onClick={() => void loadRestaurants()}
                className="mt-2 font-semibold underline"
              >
                Try loading restaurants again
              </button>
            </div>
          )}

          {!restaurantsLoading &&
            !restaurantsError &&
            restaurants.length === 0 && (
              <p className="text-sm text-slate-500">
                The restaurant API returned no restaurants.
              </p>
            )}

          <button
            type="submit"
            disabled={lookupLoading || restaurantsLoading || !restaurantId}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search className="h-4 w-4" />
            {lookupLoading ? "Loading..." : "Check status"}
          </button>
        </form>

        {lookupError && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {lookupError}
          </p>
        )}

        {subscription && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Subscription status
                </p>
                <div className="mt-2">
                  <StatusBadge status={subscription.status} />
                </div>
              </div>

              <p className="break-all text-xs text-slate-500">
                Restaurant ID: {subscription.restaurantId}
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">Plan</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {plan?.name ?? "Plan details unavailable"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Billing cycle</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {subscription.billingCycle}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Current period ends</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Period started</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(subscription.currentPeriodStart)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Trial ends</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(subscription.trialEndsAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Cancel at period end</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {subscription.cancelAtPeriodEnd ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Subscription plans
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Plans returned by the subscription API. Prices and limits are not
            generated by the frontend.
          </p>
        </div>

        {plansLoading && (
          <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
            Loading subscription plans...
          </p>
        )}

        {plansError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <p className="text-sm text-red-700">{plansError}</p>
            <button
              type="button"
              onClick={() => void loadPlans()}
              className="mt-3 text-sm font-semibold text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!plansLoading && !plansError && plans.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
            The backend returned no subscription plans.
          </p>
        )}

        {!plansLoading && !plansError && plans.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((item) => (
              <article
                key={item._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{item.code}</p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {item.description && (
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                )}

                <div className="mt-5 space-y-2">
                  <p className="text-xl font-bold text-slate-950">
                    {formatPrice(item.monthlyPrice, item.currency)}
                    <span className="text-sm font-normal text-slate-500">
                      {" "}
                      / month
                    </span>
                  </p>
                  <p className="text-sm text-slate-600">
                    {formatPrice(item.yearlyPrice, item.currency)} / year
                  </p>
                </div>

                {item.limits && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Plan limits
                    </p>
                    <dl className="mt-3 space-y-2 text-sm">
                      {Object.entries(item.limits).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between gap-3"
                        >
                          <dt className="capitalize text-slate-500">
                            {key.replace(/([A-Z])/g, " $1")}
                          </dt>
                          <dd className="font-medium text-slate-900">
                            {value ?? "Not specified"}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {item.features.length > 0 && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Features
                    </p>
                    <ul className="mt-3 space-y-2">
                      {item.features.map((feature, index) => (
                        <li
                          key={`${item._id}-feature-${index}`}
                          className="text-sm text-slate-700"
                        >
                          <span className="mr-2 text-emerald-600">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="text-xs leading-5 text-slate-500">
        This page currently provides read-only subscription information.
        Payment review, refunds, subscription changes, and restaurant payment
        holds will only be added through their documented backend operations.
      </p>
    </div>
  );
}

function AccessContent() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [assignedPermissions, setAssignedPermissions] = useState<Permission[]>(
    [],
  );

  const [roleId, setRoleId] = useState("");
  const [selectedPermissionId, setSelectedPermissionId] = useState("");

  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [loadingRole, setLoadingRole] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [roleLoaded, setRoleLoaded] = useState(false);

  async function loadPermissions() {
    setLoadingPermissions(true);
    setError("");

    try {
      const result = await getPermissions();
      setPermissions(result);

      setSelectedPermissionId((current) =>
        result.some((permission) => permission._id === current)
          ? current
          : "",
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingPermissions(false);
    }
  }

  useEffect(() => {
    void loadPermissions();
  }, []);

  function mapAssignedPermissions(
    assigned: Permission[],
    allPermissions: Permission[],
  ): Permission[] {
    // The backend currently returns raw role-permission records whose
    // permissionId may be only an ID. Match those IDs to the live permission
    // records so the UI displays actual names and descriptions.
    const mapped = assigned.map((item) => {
      const fullPermission = allPermissions.find(
        (permission) => permission._id === item._id,
      );

      return fullPermission ?? item;
    });

    return mapped.filter(
      (permission, index, list) =>
        list.findIndex((item) => item._id === permission._id) === index,
    );
  }

  async function handleRoleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setAssignedPermissions([]);
    setRoleLoaded(false);

    const id = roleId.trim();

    if (!id) {
      setError("Enter an existing role ID.");
      return;
    }

    setLoadingRole(true);

    try {
      const result = await getRolePermissions(id);
      setAssignedPermissions(mapAssignedPermissions(result, permissions));
      setRoleLoaded(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingRole(false);
    }
  }

  async function handleAssign() {
    const id = roleId.trim();

    if (!id || !roleLoaded || !selectedPermissionId) {
      setError("Load a role and select a permission before assigning.");
      return;
    }

    if (
      assignedPermissions.some(
        (permission) => permission._id === selectedPermissionId,
      )
    ) {
      setError("This permission is already assigned to the selected role.");
      return;
    }

    const selected = permissions.find(
      (permission) => permission._id === selectedPermissionId,
    );

    if (!selected?.isActive) {
      setError("Only an active permission can be assigned.");
      return;
    }

    setAssigning(true);
    setError("");
    setSuccess("");

    try {
      await assignPermissionToRole(id, selectedPermissionId);

      const refreshed = await getRolePermissions(id);
      setAssignedPermissions(mapAssignedPermissions(refreshed, permissions));
      setSuccess("Permission assignment completed and the role was reloaded.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Role permissions
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Inspect and assign permissions through the authenticated backend.
              The backend does not currently expose a documented role-list
              endpoint, so enter an existing role ID.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadPermissions()}
            disabled={loadingPermissions}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loadingPermissions ? "animate-spin" : ""
              }`}
            />
            Refresh permissions
          </button>
        </div>

        <form
          onSubmit={handleRoleLookup}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <div className="min-w-0 flex-1">
            <label
              className="sr-only"
              htmlFor="access-role-id"
            >
              Role ID
            </label>
            <input
              id="access-role-id"
              value={roleId}
              onChange={(event) => {
                setRoleId(event.target.value);
                setRoleLoaded(false);
                setAssignedPermissions([]);
                setSuccess("");
              }}
              placeholder="Enter existing role ID"
              autoComplete="off"
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <button
            type="submit"
            disabled={loadingRole || !roleId.trim()}
            className="min-h-11 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingRole ? "Loading..." : "Load role permissions"}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            {success}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-bold text-slate-900">Available permissions</h2>
        <p className="mt-1 text-sm text-slate-500">
          These records are fetched from the permissions API.
        </p>

        {loadingPermissions && (
          <p className="mt-4 text-sm text-slate-500">
            Loading permissions...
          </p>
        )}

        {!loadingPermissions && permissions.length === 0 && !error && (
          <p className="mt-4 text-sm text-slate-500">
            No active permissions were returned by the backend.
          </p>
        )}

        {permissions.length > 0 && (
          <div className="mt-4 space-y-3">
            <label
              htmlFor="permission-to-assign"
              className="block text-sm font-medium text-slate-700"
            >
              Permission to assign
            </label>

            <select
              id="permission-to-assign"
              value={selectedPermissionId}
              onChange={(event) => setSelectedPermissionId(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100"
            >
              <option value="">Select a permission</option>
              {permissions
                .filter((permission) => permission.isActive)
                .map((permission) => (
                  <option key={permission._id} value={permission._id}>
                    {permission.module} — {permission.name}
                  </option>
                ))}
            </select>

            <button
              type="button"
              onClick={() => void handleAssign()}
              disabled={
                assigning ||
                loadingPermissions ||
                !selectedPermissionId ||
                !roleLoaded
              }
              className="min-h-11 rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {assigning ? "Assigning..." : "Assign permission to role"}
            </button>

            {!roleLoaded && (
              <p className="text-xs text-slate-500">
                Load a role first to enable permission assignment.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-bold text-slate-900">Assigned permissions</h2>
        <p className="mt-1 text-sm text-slate-500">
          {roleLoaded
            ? "Permissions currently returned for the selected role."
            : "Load a role above to view its permissions."}
        </p>

        {roleLoaded && assignedPermissions.length > 0 ? (
          <div className="mt-4 divide-y divide-slate-100">
            {assignedPermissions.map((permission) => (
              <div
                key={permission._id}
                className="py-3 first:pt-0 last:pb-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-slate-900">
                    {permission.name}
                  </p>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    {permission.module}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {permission.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            {roleLoaded
              ? "The backend returned no assigned permissions for this role."
              : "No role has been loaded yet."}
          </p>
        )}
      </section>

      <p className="text-xs leading-5 text-slate-500">
        Permission removal is not available because the backend does not expose
        a documented removal endpoint. The backend remains responsible for
        validating every assignment.
      </p>
    </div>
  );
}

export default function ContractPage({ kind }: ContractPageProps) {
  const subscription = kind === "subscriptions";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#FF6B35]">
          Platform Administration
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">
          {subscription
            ? "Subscription & payment review"
            : "Access & permissions"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Live backend data only. The backend remains the source of truth.
        </p>
      </div>

      {subscription ? <SubscriptionContent /> : <AccessContent />}

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to="/platform-admin/accounts"
          className="rounded-2xl border bg-white p-5 shadow-sm hover:border-orange-200"
        >
          <ShieldAlert className="h-5 w-5 text-[#FF6B35]" />
          <p className="mt-3 font-semibold">Restaurant access</p>
          <p className="mt-1 text-sm text-slate-500">
            Manage restaurant activation using the documented status API.
          </p>
        </Link>

        <Link
          to="/audit"
          className="rounded-2xl border bg-white p-5 shadow-sm hover:border-orange-200"
        >
          <ScrollText className="h-5 w-5 text-blue-500" />
          <p className="mt-3 font-semibold">Audit controls</p>
          <p className="mt-1 text-sm text-slate-500">
            Review recorded audit events from the backend.
          </p>
        </Link>

        <Link
          to="/settings"
          className="rounded-2xl border bg-white p-5 shadow-sm hover:border-orange-200"
        >
          <CalendarDays className="h-5 w-5 text-slate-600" />
          <p className="mt-3 font-semibold">Platform settings</p>
          <p className="mt-1 text-sm text-slate-500">
            Open platform settings.
          </p>
        </Link>
      </div>
    </div>
  );
}