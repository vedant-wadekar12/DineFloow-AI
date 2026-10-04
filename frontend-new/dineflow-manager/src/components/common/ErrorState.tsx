import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ReactNode } from "react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  message?: string;
  onRetry?: () => void | Promise<void>;
  action?: ReactNode;
}

function ErrorState({
  title = "Something went wrong",
  description,
  message,
  onRetry,
  action,
}: ErrorStateProps) {
  const errorMessage =
    message ??
    description ??
    "We couldn't load this information. Please try again.";

  return (
    <div className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 p-8 text-center">
      <AlertCircle className="mb-4 h-10 w-10 text-red-500" />

      <h3 className="text-lg font-semibold text-[#111827]">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-gray-500">
        {errorMessage}
      </p>

      {action ? (
        <div className="mt-5">
          {action}
        </div>
      ) : (
        onRetry && (
          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={() => {
              void onRetry();
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )
      )}
    </div>
  );
}

export default ErrorState;