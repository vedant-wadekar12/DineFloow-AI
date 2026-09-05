import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-[#FFFDF8]/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF6B35]">
            <span className="font-bold text-white">D</span>
          </div>

          <span className="text-xl font-bold tracking-tight text-[#111827]">
            DineFlow<span className="text-[#FF6B35]"> AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/features"
            className="text-sm font-medium text-gray-600 transition hover:text-[#FF6B35]"
          >
            Features
          </Link>

          <Link
            to="/pricing"
            className="text-sm font-medium text-gray-600 transition hover:text-[#FF6B35]"
          >
            Pricing
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium text-gray-600 transition hover:text-[#FF6B35]"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="text-sm font-medium text-gray-600 transition hover:text-[#FF6B35]"
          >
            Contact
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" render={<Link to="/login" />}>
  Login
</Button>

          <Button render={<Link to="/register" />}>
  Get Started
</Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t bg-white px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link to="/features" onClick={() => setOpen(false)}>
              Features
            </Link>

            <Link to="/pricing" onClick={() => setOpen(false)}>
              Pricing
            </Link>

            <Link to="/about" onClick={() => setOpen(false)}>
              About
            </Link>

            <Link to="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>

            <div className="mt-2 flex gap-3">
              <Button
  variant="outline"
  className="flex-1"
  render={<Link to="/login" />}
>
  Login
</Button>

              <Button
  className="flex-1"
  render={<Link to="/register" />}
>
  Get Started
</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;