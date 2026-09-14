import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import DashboardLayout from "@/layouts/DashboardLayout";

// Auth
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import VerifyEmail from "@/pages/Auth/VerifyEmail";

// Dashboard
import Dashboard from "@/pages/Dashboard/Dashboard";

// Restaurants
import Restaurants from "@/pages/Restaurants/Restaurants";
import RestaurantDetailsPage from "@/pages/Restaurants/RestaurantDetailsPage";
import EditRestaurantPage from "@/pages/Restaurants/EditRestaurantPage";

// Branches
import Branches from "@/pages/Branches/Branches";
import BranchDetails from "@/pages/Branches/BranchDetails";

// Floors
import Floors from "@/pages/Floors/Floors";
import FloorDetails from "@/pages/Floors/FloorDetails";

// Tables
import Tables from "@/pages/Tables/Tables";

// Menu
import Menu from "@/pages/Menu/Menu";

// Staff
import Staff from "@/pages/Staff/Staff";

// Inventory
import Inventory from "@/pages/Inventory/Inventory";

// Orders
import Orders from "@/pages/Orders/Orders";

/**
 * Placeholder page for modules
 * that are not implemented yet.
 */
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

function NotFoundPage() {
  return (
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
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* =====================================================
          AUTH ROUTES
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

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

      {/* =====================================================
          PROTECTED APPLICATION
      ===================================================== */}

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* =================================================
              RESTAURANTS
              
              IMPORTANT:
              Put /restaurants/:id/edit BEFORE /restaurants/:id
              ================================================= */}

          <Route
            path="/restaurants"
            element={<Restaurants />}
          />

          <Route
            path="/restaurants/:id/edit"
            element={<EditRestaurantPage />}
          />

          <Route
            path="/restaurants/:id"
            element={<RestaurantDetailsPage />}
          />

          {/* =================================================
              BRANCHES
          ================================================= */}

          <Route
            path="/branches"
            element={<Branches />}
          />

          <Route
            path="/branches/:branchId"
            element={<BranchDetails />}
          />

          {/* =================================================
              FLOORS
          ================================================= */}

          <Route
            path="/floors"
            element={<Floors />}
          />

          <Route
            path="/floors/:floorId"
            element={<FloorDetails />}
          />

          {/* =================================================
              TABLES
          ================================================= */}

          <Route
            path="/tables"
            element={<Tables />}
          />

          {/* =================================================
              MENU
          ================================================= */}

          <Route
            path="/menu"
            element={<Menu />}
          />

          {/* =================================================
              STAFF
          ================================================= */}

          <Route
            path="/staff"
            element={<Staff />}
          />

          {/* =================================================
              INVENTORY
          ================================================= */}

          <Route
            path="/inventory"
            element={<Inventory />}
          />

          {/* =================================================
              ORDERS
          ================================================= */}

          <Route
            path="/orders"
            element={<Orders />}
          />

          {/* =================================================
              KITCHEN
          ================================================= */}

          <Route
            path="/kitchen"
            element={
              <PlaceholderPage
                title="Kitchen"
              />
            }
          />

          {/* =================================================
              BILLING
          ================================================= */}

          <Route
            path="/billing"
            element={
              <PlaceholderPage
                title="Billing"
              />
            }
          />

          {/* =================================================
              PAYMENTS
          ================================================= */}

          <Route
            path="/payments"
            element={
              <PlaceholderPage
                title="Payments"
              />
            }
          />

          {/* =================================================
              ANALYTICS
          ================================================= */}

          <Route
            path="/analytics"
            element={
              <PlaceholderPage
                title="Analytics"
              />
            }
          />

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <Route
            path="/notifications"
            element={
              <PlaceholderPage
                title="Notifications"
              />
            }
          />

          {/* =================================================
              AI
          ================================================= */}

          <Route
            path="/ai"
            element={
              <PlaceholderPage
                title="AI Intelligence"
              />
            }
          />

          {/* =================================================
              SETTINGS
          ================================================= */}

          <Route
            path="/settings"
            element={
              <PlaceholderPage
                title="Settings"
              />
            }
          />

          {/* =================================================
              PROFILE
          ================================================= */}

          <Route
            path="/profile"
            element={
              <PlaceholderPage
                title="Profile"
              />
            }
          />

        </Route>
      </Route>

      {/* =====================================================
          404
      ===================================================== */}

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}

export default AppRoutes;