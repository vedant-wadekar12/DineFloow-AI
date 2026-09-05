import { Check } from "lucide-react";
import PublicPage from "@/components/common/PublicPage";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For getting started.",
    features: [
      "1 Restaurant",
      "Menu Management",
      "QR Ordering",
      "Basic Analytics",
    ],
  },
  {
    name: "Growth",
    price: "₹999",
    description: "For growing restaurant teams.",
    features: [
      "Multiple Branches",
      "Advanced Analytics",
      "Inventory",
      "Staff Management",
      "Kitchen Operations",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For larger restaurant operations.",
    features: [
      "Multi-tenant Management",
      "Advanced RBAC",
      "AI Insights",
      "Priority Support",
      "Custom Integrations",
    ],
  },
];

function Pricing() {
  return (
    <PublicPage
      title="Simple, scalable pricing"
      description="Choose a plan that fits your restaurant operation."
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 lg:grid-cols-3 lg:px-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-3xl border bg-white p-8 shadow-sm"
          >
            <p className="font-semibold text-[#FF6B35]">
              {plan.name}
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {plan.price}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              {plan.description}
            </p>

            <ul className="mt-7 space-y-3">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 text-sm"
                >
                  <Check className="h-4 w-4 text-[#06D6A0]" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
  className="mt-8 w-full"
  render={<Link to="/register" />}
>
  Get Started
</Button>
          </div>
        ))}
      </div>
    </PublicPage>
  );
}

export default Pricing;