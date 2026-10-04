import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-50 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-[#FF6B35]" />

        <p className="text-sm text-gray-500">
          {message}
        </p>
      </div>
    </div>
  );
}

export default LoadingState;
