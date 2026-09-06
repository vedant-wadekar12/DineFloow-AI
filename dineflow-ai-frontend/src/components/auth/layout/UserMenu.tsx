import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName =
    user?.name ||
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    "User";

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-gray-100"
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.avatar} alt={displayName} />
          <AvatarFallback className="bg-[#FF6B35] text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="hidden text-left lg:block">
          <p className="max-w-[130px] truncate text-sm font-semibold text-gray-900">
            {displayName}
          </p>

          <p className="text-xs text-gray-500">
            {user?.role ?? "User"}
          </p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56"
      >
        <DropdownMenuItem
          onClick={() => navigate("/profile")}
        >
          <User />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/settings")}
        >
          <Settings />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;