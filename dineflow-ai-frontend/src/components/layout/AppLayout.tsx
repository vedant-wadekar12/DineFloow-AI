import { useState, type ReactNode } from "react";

import Sidebar from "@/components/auth/layout/Sidebar";
import MobileSidebar from "@/components/auth/layout/MobileSidebar";
import TopNavbar from "@/components/auth/layout/TopNavbar";
import CommandPalette from "@/components/navigation/CommandPalette";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />

      <div className="flex min-h-screen">
        <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
          <Sidebar />
        </div>

        <MobileSidebar
          open={mobileOpen}
          onOpenChange={setMobileOpen}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-[260px]">
          <TopNavbar
            onMenuClick={() => setMobileOpen(true)}
            onSearchClick={() => setCommandOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
