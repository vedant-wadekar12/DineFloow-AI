import { BarChart3, Clock3, IndianRupee, Users } from "lucide-react";

const metrics = [
  {
    icon: IndianRupee,
    label: "Revenue",
    value: "₹8.42L",
  },
  {
    icon: BarChart3,
    label: "Orders",
    value: "12,840",
  },
  {
    icon: Users,
    label: "Customers",
    value: "8,920",
  },
  {
    icon: Clock3,
    label: "Avg. Prep Time",
    value: "14 min",
  },
];

function AnalyticsSection() {
  return (
    <section className="bg-[#FFFDF8] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-semibold text-[#FF6B35]">
              ANALYTICS
            </p>

            <h2 className="mt-3 text-4xl font-bold text-[#111827] sm:text-5xl">
              Know your restaurant at a glance.
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Get a complete view of restaurant performance
              with dashboards designed for fast decisions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.label}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                >
                  <Icon className="h-6 w-6 text-[#FF6B35]" />

                  <p className="mt-5 text-sm text-gray-500">
                    {metric.label}
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {metric.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnalyticsSection;