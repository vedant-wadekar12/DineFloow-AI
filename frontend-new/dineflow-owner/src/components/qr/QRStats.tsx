import {
  QrCode,
  CheckCircle2,
  XCircle,
  Table2,
} from "lucide-react";

interface QRStatsProps {
  total: number;
  active: number;
  inactive: number;
  tablesWithQR: number;
}

function QRStats({
  total,
  active,
  inactive,
  tablesWithQR,
}: QRStatsProps) {
  const stats = [
    {
      label: "Total QR Codes",
      value: total,
      icon: QrCode,
    },
    {
      label: "Active",
      value: active,
      icon: CheckCircle2,
    },
    {
      label: "Inactive",
      value: inactive,
      icon: XCircle,
    },
    {
      label: "Tables with QR",
      value: tablesWithQR,
      icon: Table2,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-3">
                <Icon className="h-5 w-5 text-[#FF6B35]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default QRStats;