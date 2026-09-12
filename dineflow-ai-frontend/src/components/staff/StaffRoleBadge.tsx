import type { UserRole } from "@/types/auth.types";

interface StaffRoleBadgeProps {
  role: UserRole;
}

const roleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  RESTAURANT_OWNER: "Restaurant Owner",
  BRANCH_MANAGER: "Branch Manager",
  CASHIER: "Cashier",
  WAITER: "Waiter",
  CHEF: "Chef",
  KITCHEN_STAFF: "Kitchen Staff",
};

export default function StaffRoleBadge({
  role,
}: StaffRoleBadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
      {roleLabels[role] ?? role}
    </span>
  );
}