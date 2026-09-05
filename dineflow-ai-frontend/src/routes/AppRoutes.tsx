import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "@/pages/home/Home";
import Features from "@/pages/Features/Features";
import Pricing from "@/pages/Pricing/Pricing";
import About from "@/pages/About/About";
import Contact from "@/pages/Contact/Contact";

import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import VerifyEmail from "@/pages/Auth/VerifyEmail";

import Dashboard from "@/pages/Dashboard/Dashboard";

import ProtectedRoute from "@/routes/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/features"
        element={<Features />}
      />

      <Route
        path="/pricing"
        element={<Pricing />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/contact"
        element={<Contact />}
      />

      {/* Authentication */}
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

      {/* Protected application */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-2xl font-bold">
              Page Not Found
            </h1>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;