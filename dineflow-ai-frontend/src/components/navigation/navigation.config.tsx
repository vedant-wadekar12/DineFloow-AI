import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  Store,
  GitBranch,
  Layers3,
  Grid2X2,
  UtensilsCrossed,
  Users,
  Package,
  ShoppingCart,
  ChefHat,
  Receipt,
  CreditCard,
  BarChart3,
  Bell,
  Sparkles,
  Settings,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permissions?: string[];
  roles?: string[];
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Restaurants",
    href: "/restaurants",
    icon: Store,
    permissions: ["restaurant:read"],
  },

  {
    label: "Branches",
    href: "/branches",
    icon: GitBranch,
    permissions: ["branch:read"],
  },

  {
    label: "Floors",
    href: "/floors",
    icon: Layers3,
    permissions: ["floor:read"],
  },

  {
    label: "Tables",
    href: "/tables",
    icon: Grid2X2,
    permissions: ["table:read"],
  },

  {
    label: "Menu",
    href: "/menu",
    icon: UtensilsCrossed,
    permissions: ["menu:read"],
  },

  {
    label: "Staff",
    href: "/staff",
    icon: Users,
    permissions: ["employee:read"],
  },

  {
    label: "Inventory",
    href: "/inventory",
    icon: Package,
    permissions: ["inventory:read"],
  },

  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    permissions: ["order:read"],
  },

  {
    label: "Kitchen",
    href: "/kitchen",
    icon: ChefHat,
    permissions: ["kitchen:read"],
  },

  {
    label: "Billing",
    href: "/billing",
    icon: Receipt,
    permissions: ["billing:read"],
  },

  {
    label: "Payments",
    href: "/payments",
    icon: CreditCard,
    permissions: ["payment:read"],
  },

  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    permissions: ["analytics:read"],
  },

  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },

  {
    label: "AI",
    href: "/ai",
    icon: Sparkles,
  },

  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];