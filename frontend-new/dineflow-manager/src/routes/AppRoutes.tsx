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
import Dashboard from "@/pages/Dashboard/Dashboard";
import Tables from "@/pages/Tables/Tables";
import Orders from "@/pages/Orders/Orders";
import Employees from "@/pages/Employees/Employees";
import Menu from "@/pages/Menu/Menu";
import Inventory from "@/pages/Inventory/Inventory";
import Kitchen from "@/pages/Kitchen/Kitchen";
import Waiter from "@/pages/Waiter/Waiter";
import Customers from "@/pages/Customers/Customers";
import Billing from "@/pages/Billing/Billing";
import Payments from "@/pages/Payments/Payments";
import Analytics from "@/pages/Analytics/Analytics";
import Notifications from "@/pages/Notifications/Notifications";
import Settings from "@/pages/Settings/Settings";
import Profile from "@/pages/Profile/Profile";
function NotFoundPage(){return <div className="flex min-h-screen items-center justify-center bg-[#FFFDF8] p-6"><div className="text-center"><p className="text-7xl font-bold text-[#FF6B35]">404</p><h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1><p className="mt-2 text-gray-500">The page does not exist in this application.</p></div></div>}
export default function AppRoutes(){return <Routes>
<Route path="/" element={<Navigate to="/login" replace/>}/><Route path="/login" element={<Login/>}/><Route path="/forgot-password" element={<ForgotPassword/>}/><Route path="/reset-password" element={<ResetPassword/>}/><Route path="/verify-email" element={<VerifyEmail/>}/>
<Route path="/preview" element={<AppPreview title="DineFlow Manager" description="Branch manager UI preview. No fake API data is used." links={[{label:"Dashboard",href:"/dashboard"},{label:"Tables",href:"/tables"},{label:"Orders",href:"/orders"},{label:"Employees",href:"/employees"},{label:"Menu",href:"/menu"},{label:"Inventory",href:"/inventory"},{label:"Kitchen",href:"/chef"},{label:"Waiter",href:"/waiter"},{label:"Customers",href:"/customers"},{label:"Billing",href:"/billing"},{label:"Payments",href:"/payments"},{label:"Analytics",href:"/analytics"}]}/>} />
<Route element={<ProtectedRoute/>}><Route path="/role-required" element={<RoleRequired appName="DineFlow Manager" expectedRoles={["BRANCH_MANAGER"]}/>}/><Route path="/dashboard" element={<RoleLanding expectedRoles={["BRANCH_MANAGER"]} dashboardPath="/workspace" appName="DineFlow Manager"/>}/><Route element={<RoleGuard roles={["BRANCH_MANAGER"]}/>}><Route element={<DashboardLayout/>}><Route path="/workspace" element={<Dashboard/>}/><Route path="/tables" element={<Tables/>}/><Route path="/orders" element={<Orders/>}/><Route path="/employees" element={<Employees/>}/><Route path="/menu" element={<Menu/>}/><Route path="/inventory" element={<Inventory/>}/><Route path="/chef" element={<Kitchen/>}/><Route path="/waiter" element={<Waiter/>}/><Route path="/customers" element={<Customers/>}/><Route path="/billing" element={<Billing/>}/><Route path="/payments" element={<Payments/>}/><Route path="/analytics" element={<Analytics/>}/><Route path="/notifications" element={<Notifications/>}/><Route path="/settings" element={<Settings/>}/><Route path="/profile" element={<Profile/>}/></Route></Route></Route>
<Route path="*" element={<NotFoundPage/>}/></Routes>}
