import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import { buttonVariants } from "@/components/ui/button";

import { verifyEmail } from "@/services/api/auth/auth.service";

function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        await verifyEmail(token);

        setStatus("success");
        setMessage(
          "Your email has been successfully verified.",
        );
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error?.response?.data?.message ??
            "Email verification failed.",
        );
      }
    };

    verify();
  }, [token]);

  return (
    <AuthLayout
      title="Email verification"
      description="We're verifying your email address."
    >
      <div className="text-center">
        {status === "loading" && (
          <p className="text-gray-500">
            Verifying your email...
          </p>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto h-14 w-14 text-[#06D6A0]" />

            <p className="mt-4 text-gray-600">
              {message}
            </p>

            <Link
              to="/login"
              className={`${buttonVariants({
                size: "default",
              })} mt-6`}
            >
              Continue to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto h-14 w-14 text-red-500" />

            <p className="mt-4 text-gray-600">
              {message}
            </p>

            <Link
              to="/login"
              className={`${buttonVariants({
                size: "default",
              })} mt-6`}
            >
              Back to Login
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default VerifyEmail;