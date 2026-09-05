import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "@/components/auth/AuthLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { forgotPassword } from "@/services/api/auth/auth.service";

const schema = z.object({
  email: z
    .string()
    .email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

function ForgotPassword() {
  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (
    data: FormData,
  ) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await forgotPassword(data);

      setMessage(
        "If an account exists for this email, password reset instructions have been sent.",
      );
    } catch (error: any) {
      setError(
        error?.response?.data?.message ??
          "Unable to process your request.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter your email and we'll send you a reset link."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {message && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <Label>Email</Label>

          <Input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="mt-2"
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : "Send Reset Link"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          <Link
            to="/login"
            className="font-semibold text-[#FF6B35]"
          >
            Back to login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;