import PublicPage from "@/components/common/PublicPage";

function Features() {
  return (
    <PublicPage
      title="Powerful restaurant features"
      description="Everything you need to manage a modern restaurant operation."
    >
      <div className="mx-auto max-w-5xl px-5 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            "Restaurant Management",
            "Branch Management",
            "Floor & Table Management",
            "QR Ordering",
            "Menu Management",
            "Staff & RBAC",
            "Inventory Management",
            "Order Management",
            "Kitchen Operations",
            "Billing",
            "Payments",
            "Analytics",
            "Notifications",
            "AI Insights",
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-2xl border bg-white p-6 font-semibold"
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    </PublicPage>
  );
}

export default Features;