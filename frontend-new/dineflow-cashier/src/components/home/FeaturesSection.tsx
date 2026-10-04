import {
  Bell,
  ClipboardList,
  Package,
  ShieldCheck,
  Users,
  Utensils,
} from "lucide-react";

const features = [
  {
    icon: Utensils,
    title: "Menu Management",
    description:
      "Manage categories, items, pricing, availability and modifiers.",
  },
  {
    icon: Users,
    title: "Staff Management",
    description:
      "Manage employees, roles, permissions and restaurant access.",
  },
  {
    icon: Package,
    title: "Inventory",
    description:
      "Track stock levels, ingredients and inventory movement.",
  },
  {
    icon: ClipboardList,
    title: "Order Management",
    description:
      "Track every order from customer placement to completion.",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description:
      "Keep chefs, waiters and managers updated instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Multi-tenant",
    description:
      "Separate restaurant data with secure role-based access.",
  },
];

function FeaturesSection() {
  return (
    <section className="bg-[#111827] py-24 text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-semibold text-[#FFB703]">
            POWERFUL FEATURES
          </p>

          <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
            Built for the entire restaurant operation.
          </h2>

          <p className="mt-5 text-gray-400">
            From the first customer scan to the final business
            report, DineFlow AI connects everything.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:bg-white/10"
              >
                <Icon className="h-7 w-7 text-[#FFB703]" />

                <h3 className="mt-5 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;