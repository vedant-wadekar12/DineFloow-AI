import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { Button } from "@/components/ui/button";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";

import FloorStatusBadge from "@/components/floors/FloorStatusBadge";

import type { Floor } from "@/types/floor.types";

import * as floorService from "@/services/floors/floor.service";

export default function FloorDetails() {
  const navigate = useNavigate();

  const { floorId } =
    useParams<{
      floorId: string;
    }>();

  const [floor, setFloor] =
    useState<Floor | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadFloor = async () => {
    if (!floorId) {
      setError("Floor ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data =
        await floorService.getFloor(
          floorId,
        );

      setFloor(data);
    } catch {
      setError(
        "Unable to load floor.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFloor();
  }, [floorId]);

  if (loading) {
    return (
      <LoadingState message="Loading floor..." />
    );
  }

  if (!floor || error) {
    return (
      <ErrorState
        message={
          error || "Floor not found."
        }
        onRetry={loadFloor}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="ghost"
        onClick={() =>
          navigate("/floors")
        }
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Floors
      </Button>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-orange-100 p-4">
              <Building2 className="h-7 w-7 text-orange-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                {floor.name}
              </h1>

              {floor.code && (
                <p className="text-muted-foreground">
                  {floor.code}
                </p>
              )}
            </div>
          </div>

          <FloorStatusBadge
            status={floor.status}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Floor Number
          </p>

          <p className="mt-2 text-2xl font-bold">
            {floor.floorNumber ?? "—"}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Code
          </p>

          <p className="mt-2 text-2xl font-bold">
            {floor.code || "—"}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Status
          </p>

          <div className="mt-3">
            <FloorStatusBadge
              status={floor.status}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">
          Description
        </h2>

        <p className="mt-3 text-muted-foreground">
          {floor.description ||
            "No description provided."}
        </p>
      </div>

      <Button
        type="button"
        onClick={() =>
          navigate(
            `/tables?floorId=${floor.id}`,
          )
        }
      >
        Manage Tables
      </Button>
    </div>
  );
}