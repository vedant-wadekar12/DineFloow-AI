import { ChevronRight, Home } from "lucide-react";
import {
  Link,
  useLocation,
} from "react-router-dom";

function Breadcrumbs() {
  const location = useLocation();

  const segments = location.pathname
    .split("/")
    .filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm">
      <Link
        to="/dashboard"
        className="flex items-center text-gray-400 transition hover:text-[#FF6B35]"
      >
        <Home className="h-4 w-4" />
      </Link>

      {segments.map((segment, index) => {
        const path =
          "/" + segments.slice(0, index + 1).join("/");

        const label = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) =>
            char.toUpperCase(),
          );

        const isLast =
          index === segments.length - 1;

        return (
          <div
            key={path}
            className="flex items-center gap-1"
          >
            <ChevronRight className="h-4 w-4 text-gray-300" />

            {isLast ? (
              <span className="font-medium text-gray-700">
                {label}
              </span>
            ) : (
              <Link
                to={path}
                className="text-gray-400 hover:text-[#FF6B35]"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;