import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

type LoginFormData =
  z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [serverError, setServerError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (
    data: LoginFormData,
  ) => {
    try {
      setLoading(true);
      setServerError("");

      await login(data);

      navigate("/dashboard");
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ??
          "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your DineFlow workspace."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {serverError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {serverError}
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

        <div>
          <div className="flex items-center justify-between">
            <Label>Password</Label>

            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[#FF6B35]"
            >
              Forgot password?
            </Link>
          </div>

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

        <Button
          type="submit"
          className="w-full bg-[#FF6B35] hover:bg-[#e85d2d]"
          disabled={loading}
        >
          {loading
            ? "Signing in..."
            : "Sign In"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#FF6B35]"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;