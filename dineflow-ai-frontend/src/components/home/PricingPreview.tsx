import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function PricingPreview() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-[#FF6B35]">
            SIMPLE PRICING
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#111827] sm:text-5xl">
            Plans that grow with you.
          </h2>
        </div>

        <div className="mx-auto mt-14 max-w-md rounded-3xl border bg-[#FFFDF8] p-8 shadow-lg">
          <p className="text-sm font-semibold text-[#FF6B35]">
            STARTER
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            Free to explore
          </h3>

          <p className="mt-3 text-gray-600">
            Everything you need to start exploring DineFlow AI.
          </p>

          <ul className="mt-7 space-y-3">
            {[
              "Restaurant dashboard",
              "Menu management",
              "QR ordering",
              "Order management",
              "Basic analytics",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm"
              >
                <Check className="h-4 w-4 text-[#06D6A0]" />
                {item}
              </li>
            ))}
          </ul>

          <Button
            className="mt-8 w-full"
            render={<Link to="/pricing" />}
          >
            <Link to="/pricing">
              View Pricing
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default PricingPreview;