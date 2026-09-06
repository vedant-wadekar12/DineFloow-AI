import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

import Dashboard from "@/pages/Dashboard/Dashboard";

import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import VerifyEmail from "@/pages/Auth/VerifyEmail";

function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium text-[#FF6B35]">
        DineFlow AI
      </p>

      <h1 className="mt-2 text-2xl font-bold text-gray-900">
        {title}
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        This module will be implemented in a later phase.
      </p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ================= AUTH ================= */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />

      {/* ================= PROTECTED APP ================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/restaurants"
            element={
              <PlaceholderPage title="Restaurants" />
            }
          />

          <Route
            path="/branches"
            element={
              <PlaceholderPage title="Branches" />
            }
          />

          <Route
            path="/floors"
            element={
              <PlaceholderPage title="Floors" />
            }
          />

          <Route
            path="/tables"
            element={
              <PlaceholderPage title="Tables" />
            }
          />

          <Route
            path="/menu"
            element={<PlaceholderPage title="Menu" />}
          />

          <Route
            path="/staff"
            element={<PlaceholderPage title="Staff" />}
          />

          <Route
            path="/inventory"
            element={
              <PlaceholderPage title="Inventory" />
            }
          />

          <Route
            path="/orders"
            element={
              <PlaceholderPage title="Orders" />
            }
          />

          <Route
            path="/kitchen"
            element={
              <PlaceholderPage title="Kitchen" />
            }
          />

          <Route
            path="/billing"
            element={
              <PlaceholderPage title="Billing" />
            }
          />

          <Route
            path="/payments"
            element={
              <PlaceholderPage title="Payments" />
            }
          />

          <Route
            path="/analytics"
            element={
              <PlaceholderPage title="Analytics" />
            }
          />

          <Route
            path="/notifications"
            element={
              <PlaceholderPage title="Notifications" />
            }
          />

          <Route
            path="/ai"
            element={
              <PlaceholderPage title="AI Intelligence" />
            }
          />

          <Route
            path="/settings"
            element={
              <PlaceholderPage title="Settings" />
            }
          />

          <Route
            path="/profile"
            element={
              <PlaceholderPage title="Profile" />
            }
          />
        </Route>
      </Route>

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-[#FFFDF8] p-6">
            <div className="text-center">
              <p className="text-7xl font-bold text-[#FF6B35]">
                404
              </p>

              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                Page not found
              </h1>

              <p className="mt-2 text-gray-500">
                The page you're looking for doesn't exist.
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;