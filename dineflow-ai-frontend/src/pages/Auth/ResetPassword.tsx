import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { resetPassword } from "@/services/api/auth/auth.service";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

type FormData = z.infer<typeof schema>;

function ResetPassword() {
  const [searchParams] =
    useSearchParams();

  const navigate = useNavigate();

  const token =
    searchParams.get("token");

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
    if (!token) {
      setError(
        "Invalid or missing reset token.",
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await resetPassword({
        token,
        ...data,
      });

      navigate("/login");
    } catch (error: any) {
      setError(
        error?.response?.data?.message ??
          "Unable to reset password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      description="Create a new secure password."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <Label>New password</Label>

          <div className="mt-2">
            <PasswordInput
              {...register("password")}
              placeholder="••••••••"
            />
          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Label>Confirm password</Label>

          <div className="mt-2">
            <PasswordInput
              {...register("confirmPassword")}
              placeholder="••••••••"
            />
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : "Reset Password"}
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

export default ResetPassword;