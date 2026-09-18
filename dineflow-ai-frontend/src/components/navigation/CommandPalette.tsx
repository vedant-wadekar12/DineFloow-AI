import { useEffect, useState } from "react";
import {
  BarChart3,
  ChefHat,
  CreditCard,
  Grid2X2,
  LayoutDashboard,
  Package,
  Receipt,
  Search,
  ShoppingCart,
  Sparkles,
  Store,
  Users,
  UtensilsCrossed,
  X,
  QrCode,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const commands = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Restaurants", href: "/restaurants", icon: Store },
  { label: "Tables", href: "/tables", icon: Grid2X2 },
  { label: "Menu", href: "/menu", icon: UtensilsCrossed },
  { label: "Staff", href: "/staff", icon: Users },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Kitchen", href: "/kitchen", icon: ChefHat },
  { label: "Billing", href: "/billing", icon: Receipt },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "AI", href: "/ai", icon: Sparkles },
  { label: "QR Codes", href: "/qr", icon: QrCode },
{ label: "Employees", href: "/employees", icon: Users },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CommandPalette({
  open,
  onOpenChange,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        onOpenChange(!open);
      }

      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setSearch("");
    }
  }, [open]);

  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleNavigate = (href: string) => {
    onOpenChange(false);
    navigate(href);
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 p-4 backdrop-blur-sm"
      onMouseDown={() => onOpenChange(false)}
    >
      <div
        className="mx-auto mt-[15vh] w-full max-w-xl overflow-hidden rounded-2xl border bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="h-5 w-5 text-gray-400" />

          <input
            autoFocus
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search DineFlow..."
            className="h-14 flex-1 bg-transparent text-sm outline-none"
          />

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No results found.
            </div>
          ) : (
            filteredCommands.map((command) => {
              const Icon = command.icon;

              return (
                <button
                  key={command.href}
                  type="button"
                  onClick={() => handleNavigate(command.href)}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition hover:bg-gray-100"
                >
                  <Icon className="h-4 w-4 text-gray-500" />

                  <span className="font-medium text-gray-800">
                    {command.label}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="border-t bg-gray-50 px-4 py-3 text-xs text-gray-500">
          Press{" "}
          <kbd className="rounded border bg-white px-1.5 py-0.5">
            Esc
          </kbd>{" "}
          to close
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;