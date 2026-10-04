import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  Building2,
  ChevronLeft,
  ClipboardCheck,
  CreditCard,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

interface PlatformAdminLayoutProps {
  children: ReactNode;
  preview?: boolean;
}

const liveItems = [
  { label: "Overview", href: "/platform-admin", icon: LayoutDashboard },
  { label: "Restaurant Accounts", href: "/platform-admin/accounts", icon: Building2 },
  { label: "Subscription Review", href: "/platform-admin/subscriptions", icon: CreditCard },
  { label: "Access & Permissions", href: "/platform-admin/access", icon: Users },
  { label: "Audit & Controls", href: "/audit", icon: ClipboardCheck },
];

const previewItems = [
  { label: "Overview", href: "/preview", icon: LayoutDashboard },
  { label: "Restaurant Accounts", href: "/preview/accounts", icon: Building2 },
  { label: "Subscription Review", href: "/preview/subscriptions", icon: CreditCard },
  { label: "Access & Permissions", href: "/preview/access", icon: Users },
  { label: "Audit & Controls", href: "/preview/audit", icon: ClipboardCheck },
];

export default function PlatformAdminLayout({ children, preview = false }: PlatformAdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-slate-950 text-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B35]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold">DineFlow</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-300">Platform Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {(preview ? previewItems : liveItems).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={preview ? item.href === "/preview" : item.href === "/platform-admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive ? "bg-[#FF6B35] text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <NavLink to={preview ? "/preview" : "/platform-admin"} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
            Platform overview
          </NavLink>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="h-full w-80 max-w-[88vw] bg-slate-950 p-4 text-white" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between px-2 py-2">
              <p className="font-bold">Platform Admin</p>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation" className="rounded-lg p-2 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-5 space-y-1">
              {(preview ? previewItems : liveItems).map((item) => {
                const Icon = item.icon;
                return <NavLink key={item.href} to={item.href} end={preview ? item.href === "/preview" : item.href === "/platform-admin"} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${isActive ? "bg-[#FF6B35] text-white" : "text-slate-300 hover:bg-white/10"}`}><Icon className="h-4 w-4" />{item.label}</NavLink>;
              })}
            </nav>
          </aside>
        </div>
      )}

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} className="rounded-xl border border-slate-200 p-2 lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-500">Control plane</p>
              <p className="text-sm font-semibold text-slate-900">Restaurant platform administration</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {preview && <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">UI Preview</span>}
            <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 sm:inline-flex">Super Admin area</span>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
