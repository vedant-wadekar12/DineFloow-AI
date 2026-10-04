import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  onClick?: () => void;
}

function NavItem({
  label,
  href,
  icon: Icon,
  onClick,
}: NavItemProps) {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-xl px-3 py-2.5",
          "text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-[#FF6B35] text-white shadow-sm"
            : "text-gray-600 hover:bg-orange-50 hover:text-[#FF6B35]",
        ].join(" ")
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />

      <span>{label}</span>
    </NavLink>
  );
}

export default NavItem;