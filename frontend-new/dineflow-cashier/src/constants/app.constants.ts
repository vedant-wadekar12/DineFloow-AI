export const APP_NAME = "DineFlow AI";

export const APP_DESCRIPTION =
  "AI-powered restaurant operating system";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",

  DASHBOARD: "/dashboard",
  RESTAURANTS: "/restaurants",
  BRANCHES: "/branches",
  FLOORS: "/floors",
  TABLES: "/tables",
  MENU: "/menu",
  STAFF: "/staff",
  INVENTORY: "/inventory",
  ORDERS: "/orders",
  KITCHEN: "/kitchen",
  BILLING: "/billing",
  PAYMENTS: "/payments",
  ANALYTICS: "/analytics",
  NOTIFICATIONS: "/notifications",
  AI: "/ai",
  SETTINGS: "/settings",
} as const;