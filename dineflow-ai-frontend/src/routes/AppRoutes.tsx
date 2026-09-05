import { Routes, Route } from "react-router-dom";

import Home from "@/pages/home/Home";
import Features from "@/pages/Features/Features";
import Pricing from "@/pages/Pricing/Pricing";
import About from "@/pages/About/About";
import Contact from "@/pages/Contact/Contact";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

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