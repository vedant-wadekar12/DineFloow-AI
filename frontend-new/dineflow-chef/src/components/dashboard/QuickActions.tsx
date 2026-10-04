import {
  ChefHat,
  Plus,
  QrCode,
  ShoppingCart,
  UserPlus,
  UtensilsCrossed,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "New Order",
      icon: ShoppingCart,
      href: "/orders",
    },
    {
      label: "Add Menu Item",
      icon: UtensilsCrossed,
      href: "/menu",
    },
    {
      label: "Add Staff",
      icon: UserPlus,
      href: "/staff",
    },
    {
      label: "Manage Tables",
      icon: ChefHat,
      href: "/tables",
    },
    {
      label: "Generate QR",
      icon: QrCode,
      href: "/tables",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="font-semibold text-gray-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Frequently used restaurant operations.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              onClick={() => navigate(action.href)}
              className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-left transition hover:border-orange-200 hover:bg-orange-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <Icon className="h-4 w-4 text-[#FF6B35]" />
              </div>

              <span className="text-sm font-medium text-gray-700 group-hover:text-[#FF6B35]">
                {action.label}
              </span>

              <Plus className="ml-auto h-4 w-4 text-gray-300 group-hover:text-[#FF6B35]" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;