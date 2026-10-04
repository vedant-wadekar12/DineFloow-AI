import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Eye,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import SupplierFilters, {
  type SupplierStatusFilter,
} from "@/components/suppliers/SupplierFilters";

import SupplierFormDialog from "@/components/suppliers/SupplierFormDialog";
import SupplierStats from "@/components/suppliers/SupplierStats";
import SupplierStatusBadge from "@/components/suppliers/SupplierStatusBadge";

import { useAuth } from "@/hooks/useAuth";

import {
  createSupplier,
  deleteSupplier,
  getSupplierById,
  getSuppliers,
  updateSupplier,
  updateSupplierStatus,
} from "@/services/suppliers/supplier.service";

import type {
  CreateSupplierData,
  Supplier,
  UpdateSupplierData,
} from "@/types/supplier.types";

function Suppliers() {
  const { user } = useAuth();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<SupplierStatusFilter>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<
    "create" | "edit"
  >("create");
  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsSupplier, setDetailsSupplier] =
    useState<Supplier | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] =
    useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [actionSupplierId, setActionSupplierId] =
    useState<string | null>(null);

  const loadSuppliers = useCallback(
    async (showRefreshLoader = false) => {
      try {
        setError(null);

        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data = await getSuppliers();

        setSuppliers(data);
      } catch (err) {
        console.error("Failed to load suppliers:", err);

        setError(
          "Unable to load suppliers. Please try again.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadSuppliers();
  }, [loadSuppliers]);

  const filteredSuppliers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return suppliers.filter((supplier) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        supplier.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        supplier.companyName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        supplier.phone
          .toLowerCase()
          .includes(normalizedSearch) ||
        supplier.email
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        status === "all" ||
        (status === "active" && supplier.isActive) ||
        (status === "inactive" && !supplier.isActive);

      return Boolean(matchesSearch && matchesStatus);
    });
  }, [search, status, suppliers]);

  const stats = useMemo(() => {
    const active = suppliers.filter(
      (supplier) => supplier.isActive,
    ).length;

    return {
      total: suppliers.length,
      active,
      inactive: suppliers.length - active,
    };
  }, [suppliers]);

  const handleCreate = () => {
    setSelectedSupplier(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleFormSubmit = async (
    data: CreateSupplierData | UpdateSupplierData,
  ) => {
    try {
      setSubmitting(true);

      if (formMode === "create") {
        const created = await createSupplier(
          data as CreateSupplierData,
        );

        setSuppliers((current) => [
          created,
          ...current,
        ]);
      } else if (selectedSupplier) {
        const updated = await updateSupplier(
          selectedSupplier.id,
          data as UpdateSupplierData,
        );

        setSuppliers((current) =>
          current.map((supplier) =>
            supplier.id === updated.id
              ? updated
              : supplier,
          ),
        );
      }

      setFormOpen(false);
      setSelectedSupplier(null);
    } catch (err) {
      console.error("Failed to save supplier:", err);

      setError(
        "Unable to save supplier. Please check the entered information and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = async (supplier: Supplier) => {
    try {
      setDetailsOpen(true);
      setDetailsLoading(true);
      setDetailsSupplier(null);

      const data = await getSupplierById(supplier.id);

      setDetailsSupplier(data);
    } catch (err) {
      console.error(
        "Failed to load supplier details:",
        err,
      );

      setDetailsOpen(false);
      setError(
        "Unable to load supplier details. Please try again.",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleToggleStatus = async (
    supplier: Supplier,
  ) => {
    try {
      setActionSupplierId(supplier.id);

      const updated = await updateSupplierStatus(
        supplier.id,
        !supplier.isActive,
      );

      setSuppliers((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      );
    } catch (err) {
      console.error(
        "Failed to update supplier status:",
        err,
      );

      setError(
        "Unable to update supplier status. Please try again.",
      );
    } finally {
      setActionSupplierId(null);
    }
  };

  const openDeleteDialog = (supplier: Supplier) => {
    setDeleteTarget(supplier);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);

      await deleteSupplier(deleteTarget.id);

      setSuppliers((current) =>
        current.filter(
          (supplier) =>
            supplier.id !== deleteTarget.id,
        ),
      );

      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete supplier:", err);

      setError(
        "Unable to delete supplier. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
  };

  const restaurantId = user?.restaurantId ?? "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#FF6B35]">
            <Truck className="h-4 w-4" />
            Inventory Management
          </div>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Suppliers
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage supplier information, contact details,
            supplier status and procurement relationships.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => void loadSuppliers(true)}
            disabled={loading || refreshing}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={!restaurantId}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#FF6B35] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e85b2b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Add Supplier
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError(null)}
            className="rounded-md p-1 text-red-500 transition hover:bg-red-100"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <SupplierStats
        total={stats.total}
        active={stats.active}
        inactive={stats.inactive}
      />

      <SupplierFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onClear={clearFilters}
      />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Supplier Directory
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Showing {filteredSuppliers.length} of{" "}
              {suppliers.length} suppliers
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <Loader2 className="h-7 w-7 animate-spin text-[#FF6B35]" />
              <p className="text-sm">
                Loading suppliers...
              </p>
            </div>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6B35]/10">
              <Truck className="h-7 w-7 text-[#FF6B35]" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-gray-900">
              {suppliers.length === 0
                ? "No suppliers yet"
                : "No suppliers found"}
            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-500">
              {suppliers.length === 0
                ? "Add your first supplier to start managing your procurement network."
                : "Try changing your search or status filter."}
            </p>

            {suppliers.length === 0 ? (
              <button
                type="button"
                onClick={handleCreate}
                disabled={!restaurantId}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#FF6B35] px-4 text-sm font-semibold text-white transition hover:bg-[#e85b2b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                Add Supplier
              </button>
            ) : (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Supplier
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Contact
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Location
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      GST
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredSuppliers.map((supplier) => (
                    <tr
                      key={supplier.id}
                      className="transition hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {supplier.name}
                          </p>

                          {supplier.companyName && (
                            <p className="mt-0.5 text-xs text-gray-500">
                              {supplier.companyName}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-700">
                          {supplier.phone}
                        </p>

                        {supplier.email && (
                          <p className="mt-0.5 text-xs text-gray-500">
                            {supplier.email}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">
                          {[
                            supplier.city,
                            supplier.state,
                          ]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </p>

                        {supplier.pincode && (
                          <p className="mt-0.5 text-xs text-gray-500">
                            {supplier.pincode}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">
                          {supplier.gstNumber || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <SupplierStatusBadge
                          isActive={supplier.isActive}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              void handleView(supplier)
                            }
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                            title="View supplier"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(supplier)
                            }
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-[#FF6B35]/10 hover:text-[#FF6B35]"
                            title="Edit supplier"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void handleToggleStatus(
                                supplier,
                              )
                            }
                            disabled={
                              actionSupplierId ===
                              supplier.id
                            }
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                            title={
                              supplier.isActive
                                ? "Deactivate supplier"
                                : "Activate supplier"
                            }
                          >
                            {actionSupplierId ===
                            supplier.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteDialog(
                                supplier,
                              )
                            }
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                            title="Delete supplier"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-gray-100 md:hidden">
              {filteredSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900">
                        {supplier.name}
                      </h3>

                      {supplier.companyName && (
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {supplier.companyName}
                        </p>
                      )}
                    </div>

                    <SupplierStatusBadge
                      isActive={supplier.isActive}
                    />
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p className="text-gray-700">
                      <span className="font-medium">
                        Phone:
                      </span>{" "}
                      {supplier.phone}
                    </p>

                    {supplier.email && (
                      <p className="break-all text-gray-700">
                        <span className="font-medium">
                          Email:
                        </span>{" "}
                        {supplier.email}
                      </p>
                    )}

                    {(supplier.city ||
                      supplier.state) && (
                      <p className="text-gray-700">
                        <span className="font-medium">
                          Location:
                        </span>{" "}
                        {[
                          supplier.city,
                          supplier.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}

                    {supplier.gstNumber && (
                      <p className="text-gray-700">
                        <span className="font-medium">
                          GST:
                        </span>{" "}
                        {supplier.gstNumber}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        void handleView(supplier)
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(supplier)
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void handleToggleStatus(
                          supplier,
                        )
                      }
                      disabled={
                        actionSupplierId ===
                        supplier.id
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      {actionSupplierId ===
                      supplier.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : null}

                      {supplier.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openDeleteDialog(supplier)
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <SupplierFormDialog
        open={formOpen}
        mode={formMode}
        supplier={selectedSupplier}
        restaurantId={restaurantId}
        submitting={submitting}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setSelectedSupplier(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      {detailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDetailsOpen(false);
            }
          }}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="supplier-details-title"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6B35]">
                  Supplier
                </p>

                <h2
                  id="supplier-details-title"
                  className="mt-1 text-xl font-bold text-gray-900"
                >
                  Supplier Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setDetailsOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailsLoading ? (
              <div className="flex min-h-[250px] items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-[#FF6B35]" />
              </div>
            ) : detailsSupplier ? (
              <div className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {detailsSupplier.name}
                    </h3>

                    {detailsSupplier.companyName && (
                      <p className="mt-1 text-sm text-gray-500">
                        {detailsSupplier.companyName}
                      </p>
                    )}
                  </div>

                  <SupplierStatusBadge
                    isActive={
                      detailsSupplier.isActive
                    }
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DetailItem
                    label="Phone"
                    value={detailsSupplier.phone}
                  />

                  <DetailItem
                    label="Email"
                    value={
                      detailsSupplier.email || "—"
                    }
                  />

                  <DetailItem
                    label="Contact Person"
                    value={
                      detailsSupplier.contactPerson ||
                      "—"
                    }
                  />

                  <DetailItem
                    label="GST Number"
                    value={
                      detailsSupplier.gstNumber ||
                      "—"
                    }
                  />

                  <DetailItem
                    label="City"
                    value={
                      detailsSupplier.city || "—"
                    }
                  />

                  <DetailItem
                    label="State"
                    value={
                      detailsSupplier.state || "—"
                    }
                  />

                  <DetailItem
                    label="Pincode"
                    value={
                      detailsSupplier.pincode ||
                      "—"
                    }
                  />

                  <DetailItem
                    label="Branch ID"
                    value={
                      detailsSupplier.branchId ||
                      "—"
                    }
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-700">
                    {detailsSupplier.address || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Notes
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {detailsSupplier.notes || "—"}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 text-xs text-gray-400">
                  Supplier ID: {detailsSupplier.id}
                </div>
              </div>
            ) : (
              <div className="p-6 text-sm text-gray-500">
                Supplier details are unavailable.
              </div>
            )}
          </div>
        </div>
      )}

      {deleteOpen && deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleting
            ) {
              setDeleteOpen(false);
              setDeleteTarget(null);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-supplier-title"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>

            <h2
              id="delete-supplier-title"
              className="mt-4 text-lg font-bold text-gray-900"
            >
              Delete Supplier?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              You are about to delete{" "}
              <span className="font-semibold text-gray-900">
                {deleteTarget.name}
              </span>
              . This action cannot be undone from the
              frontend.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setDeleteOpen(false);
                  setDeleteTarget(null);
                }}
                disabled={deleting}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Delete Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({
  label,
  value,
}: DetailItemProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-gray-800">
        {value}
      </p>
    </div>
  );
}

export default Suppliers;