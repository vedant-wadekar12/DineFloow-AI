import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import { AuthProvider } from "@/context/AuthContext";
import { RestaurantProvider } from "@/context/RestaurantContext";
import AppRoutes from "@/routes/AppRoutes";

createRoot(
  document.getElementById("root")!,
).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RestaurantProvider>
          <AppRoutes />
        </RestaurantProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);