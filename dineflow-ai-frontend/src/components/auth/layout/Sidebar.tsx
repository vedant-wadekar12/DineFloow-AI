import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Utensils } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import NavItem from "@/components/navigation/NavItem";
import { navigationItems } from "@/components/navigation/navigation.config";

interface SidebarProps {
  onNavigate?: () => void;
}

function Sidebar({ onNavigate }: SidebarProps) {
  const { user } = useAuth();

  const visibleItems = useMemo(() => {
    return navigationItems.filter((item) => {
      if (!item.permissions?.length) {
        return true;
      }

      if (!user?.permissions?.length) {
        return false;
      }

      return item.permissions.some((permission) =>
        user.permissions?.includes(permission),
      );
    });
  }, [user]);

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-gray-100 px-5">
        <Link
          to="/dashboard"
          className="flex items-center gap-3"
          onClick={onNavigate}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B35] text-white shadow-sm">
            <Utensils className="h-5 w-5" />
          </div>

          <div>
            <p className="text-base font-bold text-gray-900">
              DineFlow
            </p>

            <p className="text-[11px] font-medium text-[#FF6B35]">
              AI RESTAURANT OS
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
          Workspace
        </p>

        <div className="space-y-1">
          {visibleItems.map((item) => (
            <NavItem
              key={item.href}
              label={item.label}
              href={item.href}
              icon={item.icon}
              onClick={onNavigate}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4">
        <div className="rounded-xl bg-orange-50 p-3">
          <p className="text-xs font-semibold text-gray-900">
            DineFlow AI
          </p>

          <p className="mt-1 text-[11px] leading-4 text-gray-500">
            Smart restaurant operations powered by AI.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;