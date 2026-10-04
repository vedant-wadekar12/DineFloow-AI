import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="grid min-h-screen lg:grid-cols-2">

        <div className="hidden bg-[#111827] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B35]">
              <span className="font-bold">
                D
              </span>
            </div>

            <span className="text-xl font-bold">
              DineFlow AI
            </span>
          </Link>

          <div className="max-w-lg">
            <p className="text-4xl font-bold leading-tight">
              Run your restaurant smarter.
            </p>

            <p className="mt-5 leading-7 text-gray-400">
              One intelligent platform for ordering,
              operations, analytics and restaurant growth.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} DineFlow AI
          </p>
        </div>

        <div className="flex items-center justify-center px-5 py-12">
          <div className="w-full max-w-md">

            <div className="mb-8 lg:hidden">
              <Link
                to="/"
                className="flex items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF6B35]">
                  <span className="font-bold text-white">
                    D
                  </span>
                </div>

                <span className="text-xl font-bold">
                  DineFlow AI
                </span>
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-[#111827]">
              {title}
            </h1>

            {description && (
              <p className="mt-2 text-sm text-gray-500">
                {description}
              </p>
            )}

            <div className="mt-8">
              {children}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthLayout;