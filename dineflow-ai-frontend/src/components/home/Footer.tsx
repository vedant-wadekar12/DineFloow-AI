import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF6B35]">
                <span className="font-bold">D</span>
              </div>

              <span className="text-xl font-bold">
                DineFlow AI
              </span>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-6 text-gray-400">
              The intelligent operating system for modern
              restaurants.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Product
            </h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <Link className="block hover:text-white" to="/features">
                Features
              </Link>

              <Link className="block hover:text-white" to="/pricing">
                Pricing
              </Link>

              <Link className="block hover:text-white" to="/login">
                Login
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">
              Company
            </h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <Link className="block hover:text-white" to="/about">
                About
              </Link>

              <Link className="block hover:text-white" to="/contact">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">
              Get Started
            </h3>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Start building a smarter restaurant operation.
            </p>

            <Link
              to="/register"
              className="mt-4 inline-block text-sm font-semibold text-[#FFB703]"
            >
              Create an account →
            </Link>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} DineFlow AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;