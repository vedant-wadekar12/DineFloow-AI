import { BarChart3, ChefHat, CreditCard, ShoppingBag } from "lucide-react";

const features = [
  {
    icon: ShoppingBag,
    title: "Smart Ordering",
    description:
      "Let customers scan a QR code, browse your menu and order directly from their table.",
  },
  {
    icon: ChefHat,
    title: "Kitchen Operations",
    description:
      "Give your kitchen a real-time view of incoming orders and preparation status.",
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    description:
      "Manage bills, payments, taxes and transactions from one place.",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description:
      "Understand revenue, orders, menu performance and restaurant trends.",
  },
];

function ProductOverview() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-semibold text-[#FF6B35]">
            ONE PLATFORM
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl">
            Everything your restaurant needs.
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            Replace disconnected tools with one intelligent
            operating system built specifically for restaurants.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border bg-[#FFFDF8] p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B35]/10">
                  <Icon className="h-6 w-6 text-[#FF6B35]" />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
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

export default ProductOverview;