import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";

import CustomerDetailsDialog from "@/components/customer/CustomerDetailsDialog";
import CustomerFilters from "@/components/customer/CustomerFilters";
import CustomerFormDialog from "@/components/customer/CustomerFormDialog";
import CustomerStats from "@/components/customer/CustomerStats";
import CustomerTable from "@/components/customer/CustomerTable";
import DeleteCustomerDialog from "@/components/customer/DeleteCustomerDialog";

import customerService from "@/services/customer/customer.service";

import { useAuth } from "@/hooks/useAuth";

import type {
  CreateCustomerData,
  Customer,
  CustomerStatus,
  UpdateCustomerData,
} from "@/types/customer.types";

function Customers() {
  const { user } = useAuth();

  const restaurantId =
    user?.restaurantId ?? "";

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<CustomerStatus | "ALL">(
      "ALL",
    );

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [viewingCustomer, setViewingCustomer] =
    useState<Customer | null>(null);

  const [deletingCustomer, setDeletingCustomer] =
    useState<Customer | null>(null);

  const [statusCustomer, setStatusCustomer] =
    useState<Customer | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const loadCustomers = async (
    refresh = false,
  ) => {
    if (!restaurantId) {
      setCustomers([]);
      setIsLoading(false);
      return;
    }

    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError("");

      const data =
        await customerService.getByRestaurant(
          restaurantId,
        );

      setCustomers(data);
    } catch {
      setError(
        "Unable to load customers. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void loadCustomers();
  }, [restaurantId]);

  const filteredCustomers =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return customers.filter(
        (customer) => {
          const matchesSearch =
            !query ||
            `${customer.firstName} ${customer.lastName ?? ""}`
              .toLowerCase()
              .includes(query) ||
            customer.phone
              .toLowerCase()
              .includes(query) ||
            customer.email
              ?.toLowerCase()
              .includes(query);

          const matchesStatus =
            status === "ALL" ||
            customer.status === status;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [customers, search, status]);

  const handleCreate = async (
    data:
      | CreateCustomerData
      | UpdateCustomerData,
  ) => {
    if (
      !("restaurantId" in data)
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const customer =
        await customerService.create(data);

      setCustomers((current) => [
        customer,
        ...current,
      ]);

      setFormOpen(false);
      setEditingCustomer(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (
    data:
      | CreateCustomerData
      | UpdateCustomerData,
  ) => {
    if (
      !editingCustomer ||
      "restaurantId" in data
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const customer =
        await customerService.update(
          editingCustomer._id,
          data,
        );

      setCustomers((current) =>
        current.map((item) =>
          item._id === customer._id
            ? customer
            : item,
        ),
      );

      setFormOpen(false);
      setEditingCustomer(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (
    data:
      | CreateCustomerData
      | UpdateCustomerData,
  ) => {
    try {
      if (editingCustomer) {
        await handleUpdate(data);
      } else {
        await handleCreate(data);
      }
    } catch {
      throw new Error(
        "Customer save failed.",
      );
    }
  };

  const handleStatusChange =
    async (newStatus: CustomerStatus) => {
      if (!statusCustomer) {
        return;
      }

      try {
        const updated =
          await customerService.updateStatus(
            statusCustomer._id,
            {
              status: newStatus,
            },
          );

        setCustomers((current) =>
          current.map((customer) =>
            customer._id === updated._id
              ? updated
              : customer,
          ),
        );

        setStatusCustomer(null);
      } catch {
        setError(
          "Unable to update customer status.",
        );
      }
    };

  const handleDelete = async () => {
    if (!deletingCustomer) {
      return;
    }

    setIsDeleting(true);

    try {
      await customerService.delete(
        deletingCustomer._id,
      );

      setCustomers((current) =>
        current.filter(
          (customer) =>
            customer._id !==
            deletingCustomer._id,
        ),
      );

      setDeletingCustomer(null);
    } catch {
      setError(
        "Unable to delete customer.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreate = () => {
    setEditingCustomer(null);
    setFormOpen(true);
  };

  const openEdit = (
    customer: Customer,
  ) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-[#FF6B35]" />

            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Customers
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Manage your restaurant customers and their information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              void loadCustomers(true)
            }
            disabled={
              isRefreshing ||
              isLoading
            }
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw
              className={[
                "h-4 w-4",
                isRefreshing
                  ? "animate-spin"
                  : "",
              ].join(" ")}
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#FF6B35] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e85a29]"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
        </div>
      </div>

      {!restaurantId && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          Your account is not associated with a
          restaurant yet. Customer management requires a
          restaurant ID.
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              void loadCustomers(true)
            }
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <CustomerStats
        customers={customers}
      />

      <CustomerFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onClear={() => {
          setSearch("");
          setStatus("ALL");
        }}
      />

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="space-y-4">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        </div>
      ) : (
        <CustomerTable
          customers={filteredCustomers}
          onView={setViewingCustomer}
          onEdit={openEdit}
          onDelete={setDeletingCustomer}
          onStatusChange={
            setStatusCustomer
          }
        />
      )}

      {statusCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900">
              Change Customer Status
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Select a new status for{" "}
              <span className="font-semibold text-gray-800">
                {statusCustomer.firstName}{" "}
                {statusCustomer.lastName ??
                  ""}
              </span>
              .
            </p>

            <div className="mt-5 space-y-2">
              {(
                [
                  "ACTIVE",
                  "INACTIVE",
                  "BLOCKED",
                ] as CustomerStatus[]
              ).map((customerStatus) => (
                <button
                  key={customerStatus}
                  type="button"
                  onClick={() =>
                    void handleStatusChange(
                      customerStatus,
                    )
                  }
                  className={[
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition",
                    statusCustomer.status ===
                    customerStatus
                      ? "border-[#FF6B35] bg-orange-50 text-[#FF6B35]"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {customerStatus}

                  {statusCustomer.status ===
                    customerStatus && (
                    <span className="text-xs">
                      Current
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setStatusCustomer(null)
              }
              className="mt-5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <CustomerFormDialog
        open={formOpen}
        customer={editingCustomer}
        restaurantId={restaurantId}
        isSubmitting={isSubmitting}
        onClose={() => {
          if (!isSubmitting) {
            setFormOpen(false);
            setEditingCustomer(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      <CustomerDetailsDialog
        open={Boolean(viewingCustomer)}
        customer={viewingCustomer}
        onClose={() =>
          setViewingCustomer(null)
        }
      />

      <DeleteCustomerDialog
        open={Boolean(deletingCustomer)}
        customer={deletingCustomer}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setDeletingCustomer(null);
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Customers;