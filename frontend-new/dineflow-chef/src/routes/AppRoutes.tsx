import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";
import DashboardLayout from "@/layouts/DashboardLayout";
import Login from "@/pages/Auth/Login";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
import RoleLanding from "@/app/RoleLanding";
import RoleRequired from "@/app/RoleRequired";
import AppPreview from "@/app/AppPreview";
import Tables from "@/pages/Tables/Tables";
import Orders from "@/pages/Orders/Orders";
import Customers from "@/pages/Customers/Customers";
import Notifications from "@/pages/Notifications/Notifications";
import Profile from "@/pages/Profile/Profile";
import Settings from "@/pages/Settings/Settings";
import Billing from "@/pages/Billing/Billing";
import Payments from "@/pages/Payments/Payments";
import Waiter from "@/pages/Waiter/Waiter";
import Kitchen from "@/pages/Kitchen/Kitchen";
import Workspace from "@/workspaces/chef/ChefWorkspace";

function NotFoundPage(){return <div className="flex min-h-screen items-center justify-center bg-[#FFFDF8] p-6"><div className="text-center"><p className="text-7xl font-bold text-[#FF6B35]">404</p><h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1><p className="mt-2 text-gray-500">The page does not exist in this application.</p></div></div>}

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/preview" element={<AppPreview title="DineFlow Chef" description="Role workspace preview. No fake API data is used." links={[{label:"Dashboard",href:"/dashboard"}, {label:"Kitchen",href:"/chef"}, {label:"Orders",href:"/orders"}, {label:"Unavailable Items",href:"/tables"}, {label:"Notifications",href:"/notifications"}, {label:"Profile",href:"/profile"}]} />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/role-required" element={<RoleRequired appName="DineFlow Chef" expectedRoles={["CHEF","KITCHEN_STAFF"]} />} />
        <Route path="/dashboard" element={<RoleLanding expectedRoles={["CHEF","KITCHEN_STAFF"]} dashboardPath="/workspace" appName="DineFlow Chef" />} />
        <Route element={<RoleGuard roles={["CHEF","KITCHEN_STAFF"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/waiter" element={<Waiter />} />
            <Route path="/chef" element={<Kitchen />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
