import { useEffect, useState, type FormEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ScrollText,
  Search,
} from "lucide-react";
import axios from "axios";

import {
  getAudits,
  type AuditEvent,
  type AuditFilters,
} from "@/services/audit/audit.service";

const PAGE_SIZE = 20;

const EMPTY_FILTERS: AuditFilters = {
  restaurantId: "",
  branchId: "",
  userId: "",
  resource: "",
  action: "",
};

function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) {
      return "Access denied. Your account may not have the audit:read permission.";
    }

    if (error.response?.status === 401) {
      return "Your session could not be authenticated. Please sign in again.";
    }

    if (!error.response) {
      return "Cannot connect to the backend. Check that the backend is running and the API URL is correct.";
    }

    return (
      (error.response.data as { message?: string } | undefined)?.message ??
      `The audit request failed (HTTP ${error.response.status}).`
    );
  }

  return error instanceof Error
    ? error.message
    : "Unable to load audit records.";
}

export default function Audit() {
  const [draft, setDraft] = useState<AuditFilters>(EMPTY_FILTERS);
  const [filters, setFilters] = useState<AuditFilters>({});
  const [records, setRecords] = useState<AuditEvent[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadAudits() {
      setLoading(true);
      setError(null);

      try {
        const result = await getAudits({
          ...filters,
          page,
          limit: PAGE_SIZE,
        });

        if (cancelled) return;

        setRecords(result.data);
        setTotal(result.pagination.total);
        setTotalPages(result.pagination.totalPages);
      } catch (err) {
        if (cancelled) return;

        setRecords([]);
        setTotal(0);
        setTotalPages(0);
        setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadAudits();

    return () => {
      cancelled = true;
    };
  }, [filters, page, refreshKey]);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFilters = Object.fromEntries(
      Object.entries(draft).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ]),
    ) as AuditFilters;

    setPage(1);
    setFilters(nextFilters);
  }

  function clearFilters() {
    setDraft(EMPTY_FILTERS);
    setFilters({});
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#FF6B35]">
            <ScrollText className="h-4 w-4" />
            Platform administration
          </div>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Audit &amp; Controls
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review audit events returned by the backend. Records are not
            generated or simulated by this page.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((value) => value + 1)}
          disabled={loading}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      <form
        onSubmit={applyFilters}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3"
      >
        {(
          [
            ["restaurantId", "Restaurant ID"],
            ["branchId", "Branch ID"],
            ["userId", "User ID"],
            ["resource", "Resource"],
            ["action", "Action"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">
              {label}
            </span>
            <input
              value={draft[key] ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              placeholder={`Filter by ${label.toLowerCase()}`}
              className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </label>
        ))}

        <div className="flex flex-wrap items-end gap-2">
          <button
            type="submit"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            <Search className="h-4 w-4" />
            Apply filters
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="min-h-10 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </form>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <p className="font-semibold">Audit records could not be loaded</p>
          <p className="mt-1">{error}</p>
          <p className="mt-2 text-xs">
            Check the backend status, your login, and the audit:read permission.
          </p>
          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            className="mt-3 rounded-lg border border-red-300 px-3 py-1.5 font-semibold hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-5">
          <div>
            <h2 className="font-bold text-slate-950">Audit events</h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading ? "Loading backend records…" : `${total} record(s) reported by the backend`}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Page {page}{totalPages > 0 ? ` of ${totalPages}` : ""}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading real audit events…
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-slate-500">
            The table is unavailable until the request succeeds.
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center">
            <ScrollText className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-800">
              No audit records found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              There are no records for these filters in the backend response.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Date &amp; time</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Resource</th>
                  <th className="px-5 py-3">User ID</th>
                  <th className="px-5 py-3">Restaurant ID</th>
                  <th className="px-5 py-3">Request</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record, index) => (
                  <tr key={record._id ?? record.id ?? `${record.createdAt}-${index}`}>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(record.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-800">
                        {record.action}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{record.resource}</p>
                      {record.resourceId && (
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {record.resourceId}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {record.userId ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {record.restaurantId ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {record.method}
                      </p>
                      <p className="mt-1 break-all text-xs text-slate-500">
                        {record.path}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
          <p className="text-sm text-slate-500">
            Showing {records.length} record(s) on this page
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading || page <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              disabled={loading || totalPages === 0 || page >= totalPages}
              onClick={() => setPage((value) => value + 1)}
              className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}