import { Menu, Search } from "lucide-react";

import RestaurantSelector from "./RestaurantSelector";
import NotificationButton from "./NotificationButton";
import UserMenu from "./UserMenu";
import Breadcrumbs from "./Breadcrumbs";

interface TopNavbarProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

function TopNavbar({
  onMenuClick,
  onSearchClick,  
}: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-[#FFFDF8]/95 backdrop-blur">
      <div className="flex h-20 items-center gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden xl:block">
            <Breadcrumbs />
          </div>

          <div className="xl:hidden">
            <RestaurantSelector />
          </div>
        </div>

        {/* Desktop Search */}
<div className="hidden flex-1 justify-center lg:flex">
  <button
    type="button"
    onClick={onSearchClick}
    className="flex w-full max-w-md items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-left text-sm text-gray-400 transition hover:border-orange-200"
  >
    <Search className="h-4 w-4" />

    <span className="flex-1">
      Search anything...
    </span>

    <kbd className="hidden rounded border bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400 xl:inline-block">
      Ctrl K
    </kbd>
  </button>
</div>

{/* Mobile Search */}
<button
  type="button"
  onClick={onSearchClick}
  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-orange-200 hover:text-[#FF6B35] lg:hidden"
  aria-label="Search"
>
  <Search className="h-5 w-5" />
</button>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:block">
            <RestaurantSelector />
          </div>

          <NotificationButton />

          <UserMenu />
        </div>
      </div>

      <div className="border-t border-gray-100 px-4 py-2 xl:hidden">
        <Breadcrumbs />
      </div>
    </header>
  );
}

export default TopNavbar;