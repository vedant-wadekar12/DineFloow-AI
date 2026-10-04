import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import BranchStatusBadge from "@/components/branches/BranchStatusBadge";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";

import type { Branch } from "@/types/branch.types";

import * as branchService from "@/services/branches/branch.service";

export default function BranchDetails() {
  const navigate = useNavigate();

  const { branchId } = useParams<{
    branchId: string;
  }>();

  const [branch, setBranch] =
    useState<Branch | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadBranch = async () => {
    if (!branchId) {
      setError("Branch ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data =
        await branchService.getBranch(
          branchId,
        );

      setBranch(data);
    } catch (error) {
      console.error(
        "Failed to load branch details:",
        error,
      );

      setError(
        "Unable to load branch details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBranch();
  }, [branchId]);

  if (loading) {
    return (
      <LoadingState message="Loading branch..." />
    );
  }

  if (error || !branch) {
    return (
      <ErrorState
        message={
          error || "Branch not found."
        }
        onRetry={loadBranch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="ghost"
        onClick={() => navigate("/branches")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Branches
      </Button>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-orange-100 p-4">
              <Building2 className="h-7 w-7 text-orange-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                {branch.name}
              </h1>

              {branch.code && (
                <p className="text-muted-foreground">
                  {branch.code}
                </p>
              )}
            </div>
          </div>

          <BranchStatusBadge
            status={branch.status}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Information */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-5 text-lg font-semibold">
            Contact Information
          </h2>

          <div className="space-y-4">
            <div className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Phone
                </p>

                <p className="font-medium">
                  {branch.phone ||
                    "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Email
                </p>

                <p className="font-medium">
                  {branch.email ||
                    "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-5 text-lg font-semibold">
            Address
          </h2>

          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />

            <div className="text-sm leading-6">
              <p>
                {branch.address ||
                  "Address not provided"}
              </p>

              {(branch.city ||
                branch.state) && (
                <p>
                  {[
                    branch.city,
                    branch.state,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}

              {(branch.country ||
                branch.postalCode) && (
                <p>
                  {[
                    branch.country,
                    branch.postalCode,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-5 text-lg font-semibold">
            Regional Settings
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Timezone
              </span>

              <span className="font-medium">
                {branch.timezone || "—"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Currency
              </span>

              <span className="font-medium">
                {branch.currency || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Management */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-5 text-lg font-semibold">
            Management
          </h2>

          <div className="text-sm">
            <p className="text-muted-foreground">
              Branch Manager
            </p>

            <p className="mt-1 font-medium">
              {branch.managerName ||
                "No manager assigned"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}