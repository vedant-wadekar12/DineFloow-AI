import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Store, GitBranch, Layers3, Grid2X2, QrCode, UtensilsCrossed, Users, UsersRound, Package, Truck, ShoppingCart, ChefHat, HandPlatter, Receipt, CreditCard, BarChart3, FileText, Bell, Sparkles, Settings, BadgePercent, Gift, HeartHandshake, WalletCards, ClipboardList, UploadCloud, ScrollText, ShieldCheck } from "lucide-react";
import type { UserRole } from "@/types/auth.types";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permissions?: string[];
  roles?: UserRole[];
}

const managementRoles: UserRole[] = ["RESTAURANT_OWNER", "BRANCH_MANAGER"];
const serviceRoles: UserRole[] = ["RESTAURANT_OWNER", "BRANCH_MANAGER", "CASHIER", "WAITER", "CHEF", "KITCHEN_STAFF"];

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Restaurants", href: "/restaurants", icon: Store, roles: ["RESTAURANT_OWNER", "BRANCH_MANAGER"] },
  { label: "Branches", href: "/branches", icon: GitBranch, roles: managementRoles },
  { label: "Floors", href: "/floors", icon: Layers3, roles: managementRoles },
  { label: "Tables", href: "/tables", icon: Grid2X2, roles: serviceRoles },
  { label: "QR Codes", href: "/qr", icon: QrCode, roles: managementRoles },
  { label: "Menu", href: "/menu", icon: UtensilsCrossed, roles: managementRoles },
  { label: "Staff Management", href: "/staff", icon: Users, roles: managementRoles },
  { label: "Employees", href: "/employees", icon: UsersRound, roles: managementRoles },
  { label: "Customers", href: "/customers", icon: Users, roles: serviceRoles },
  { label: "Inventory", href: "/inventory", icon: Package, roles: managementRoles },
  { label: "Suppliers", href: "/suppliers", icon: Truck, roles: managementRoles },
  { label: "Purchases", href: "/purchases", icon: ClipboardList, roles: managementRoles },
  { label: "Orders", href: "/orders", icon: ShoppingCart, roles: serviceRoles },
  { label: "Kitchen", href: "/chef", icon: ChefHat, roles: ["RESTAURANT_OWNER", "BRANCH_MANAGER", "CHEF", "KITCHEN_STAFF"] },
  { label: "Waiter", href: "/waiter", icon: HandPlatter, roles: ["RESTAURANT_OWNER", "BRANCH_MANAGER", "WAITER"] },
  { label: "Billing", href: "/billing", icon: Receipt, roles: ["RESTAURANT_OWNER", "BRANCH_MANAGER", "CASHIER"] },
  { label: "Payments", href: "/payments", icon: CreditCard, roles: ["RESTAURANT_OWNER", "BRANCH_MANAGER", "CASHIER"] },
  { label: "Analytics", href: "/analytics", icon: BarChart3, roles: managementRoles },
  { label: "Reports", href: "/reports", icon: FileText, roles: managementRoles },
  { label: "Notifications", href: "/notifications", icon: Bell, roles: serviceRoles },
  { label: "AI", href: "/ai", icon: Sparkles, roles: managementRoles },
  { label: "Subscription", href: "/subscription", icon: WalletCards, roles: ["RESTAURANT_OWNER"] },
  { label: "Coupons", href: "/coupons", icon: BadgePercent, roles: managementRoles },
  { label: "Offers", href: "/offers", icon: Gift, roles: managementRoles },
  { label: "Loyalty", href: "/loyalty", icon: HeartHandshake, roles: managementRoles },
  { label: "Audit Log", href: "/audit", icon: ScrollText, roles: managementRoles },
  { label: "Uploads", href: "/uploads", icon: UploadCloud, roles: managementRoles },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Platform Admin", href: "/platform-admin", icon: ShieldCheck, roles: ["SUPER_ADMIN"] },
];

export default navigationItems;
