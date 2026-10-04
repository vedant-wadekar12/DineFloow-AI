import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";
import Login from "@/pages/Auth/Login";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
import Unauthorized from "@/pages/Auth/Unauthorized";
import PlatformAdminLayout from "@/platform-admin/PlatformAdminLayout";
import PlatformAdminDashboard from "@/platform-admin/pages/PlatformAdminDashboard";
import PlatformAdminPreview from "@/platform-admin/pages/PlatformAdminPreview";
import RestaurantAccounts from "@/platform-admin/pages/RestaurantAccounts";
import ContractPage from "@/platform-admin/pages/ContractPage";
import PlatformAdminSectionPreview from "@/platform-admin/pages/PlatformAdminSectionPreview";
import Audit from "@/pages/Audit/Audit";
import Settings from "@/pages/Settings/Settings";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFFDF8] p-6">
      <div className="text-center">
        <p className="text-7xl font-bold text-[#FF6B35]">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-2 text-gray-500">The page does not exist in the Platform Admin application.</p>
      </div>
    </div>
  );
}

function PlatformAdminPreviewRouter() {
  const path = window.location.pathname.replace(/\/$/, "");
  const kind = path === "/preview/accounts"
    ? "accounts"
    : path === "/preview/subscriptions"
      ? "subscriptions"
      : path === "/preview/access"
        ? "access"
        : path === "/preview/audit"
          ? "audit"
          : null;

  return (
    <PlatformAdminLayout preview>
      {kind ? <PlatformAdminSectionPreview kind={kind} /> : <PlatformAdminPreview />}
    </PlatformAdminLayout>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Presentation-first entry point. It is explicitly a UI preview and never grants API access. */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard roles={["SUPER_ADMIN"]} />}>
          <Route path="/preview" element={<PlatformAdminPreviewRouter />} />
          <Route path="/preview/*" element={<PlatformAdminPreviewRouter />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard roles={["SUPER_ADMIN"]} />}>
          <Route
            path="/dashboard"
            element={
              <PlatformAdminLayout>
                <PlatformAdminDashboard />
              </PlatformAdminLayout>
            }
          />
          <Route
            path="/platform-admin"
            element={
              <PlatformAdminLayout>
                <PlatformAdminDashboard />
              </PlatformAdminLayout>
            }
          />
          <Route
            path="/platform-admin/accounts"
            element={
              <PlatformAdminLayout>
                <RestaurantAccounts />
              </PlatformAdminLayout>
            }
          />
          <Route
            path="/platform-admin/subscriptions"
            element={
              <PlatformAdminLayout>
                <ContractPage kind="subscriptions" />
              </PlatformAdminLayout>
            }
          />
          <Route
            path="/platform-admin/access"
            element={
              <PlatformAdminLayout>
                <ContractPage kind="access" />
              </PlatformAdminLayout>
            }
          />
          <Route
            path="/audit"
            element={
              <PlatformAdminLayout>
                <Audit />
              </PlatformAdminLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <PlatformAdminLayout>
                <Settings />
              </PlatformAdminLayout>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
