import {
  Building2,
  CheckCircle2,
  Users,
} from "lucide-react";

interface SupplierStatsProps {
  total: number;
  active: number;
  inactive: number;
}

function SupplierStats({
  total,
  active,
  inactive,
}: SupplierStatsProps) {
  const stats = [
    {
      label: "Total Suppliers",
      value: total,
      icon: Users,
      iconClassName: "bg-[#FF6B35]/10 text-[#FF6B35]",
    },
    {
      label: "Active Suppliers",
      value: active,
      icon: CheckCircle2,
      iconClassName: "bg-[#06D6A0]/10 text-[#06D6A0]",
    },
    {
      label: "Inactive Suppliers",
      value: inactive,
      icon: Building2,
      iconClassName: "bg-gray-100 text-gray-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClassName}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SupplierStats;