import { ArrowUpRight, CheckCircle2, Clock3, Plus, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ModuleMetric {
  label: string;
  value: string;
  hint?: string;
}

export interface ModuleActivity {
  title: string;
  description: string;
  status?: string;
}

interface ModulePageProps {
  title: string;
  description: string;
  metrics?: ModuleMetric[];
  activities?: ModuleActivity[];
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export default function ModulePage({
  title,
  description,
  metrics = [],
  activities = [],
  actionLabel,
  onAction,
  children,
}: ModulePageProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={
          actionLabel ? (
            <Button onClick={onAction}>
              <Plus className="mr-2 h-4 w-4" />
              {actionLabel}
            </Button>
          ) : undefined
        }
      />

      {metrics.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label} className="border-gray-200 shadow-sm">
              <CardContent className="p-5">
                <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-[#111827]">{metric.value}</p>
                {metric.hint && <p className="mt-1 text-xs text-gray-500">{metric.hint}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {children}

      {activities.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.title} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  {activity.status === "pending" ? <Clock3 className="h-4 w-4 text-amber-500" /> : <CheckCircle2 className="h-4 w-4 text-[#06D6A0]" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{activity.description}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {metrics.length === 0 && activities.length === 0 && (
        <Card>
          <CardContent className="flex min-h-60 flex-col items-center justify-center text-center">
            <RefreshCw className="h-8 w-8 text-[#FF6B35]" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Workspace ready</h2>
            <p className="mt-2 max-w-lg text-sm text-gray-500">This module is ready for its documented API contract. No backend behavior has been invented on the frontend.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
