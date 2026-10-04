import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth.types";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function getLoginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data;
    if (typeof responseData === "object" && responseData !== null && "message" in responseData) {
      const message = (responseData as { message?: unknown }).message;
      if (typeof message === "string" && message.trim()) return message;
    }

    if (!error.response) {
      return "Unable to connect to DineFlow server. Check VITE_API_BASE_URL and make sure the backend is running.";
    }

    if (error.response.status === 401) return "Invalid email or password.";
    if (error.response.status === 403) return "This account is not authorized to sign in.";
    if (error.response.status >= 500) return "DineFlow server error. Please try again.";
  }

  if (error instanceof Error && error.message === "PLATFORM_ADMIN_ROLE_REQUIRED") {
    return "This account is not a SUPER_ADMIN account and cannot access Platform Admin.";
  }

  return "Unable to sign in. Please try again.";
}

function Login() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setServerError("");
      const authenticatedUser = await login(data);

      const roles: UserRole[] = authenticatedUser.roles ?? (authenticatedUser.role ? [authenticatedUser.role] : []);
      if (!roles.includes("SUPER_ADMIN")) {
        await logout();
        throw new Error("PLATFORM_ADMIN_ROLE_REQUIRED");
      }

      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      setServerError(getLoginErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" description="Sign in to your DineFlow workspace.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {serverError && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input {...register("email")} id="email" type="email" autoComplete="email" placeholder="you@example.com" className="mt-2" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-[#FF6B35]">Forgot password?</Link>
          </div>
          <div className="mt-2">
            <PasswordInput {...register("password")} id="password" autoComplete="current-password" placeholder="••••••••" />
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full bg-[#FF6B35] hover:bg-[#e85d2d]" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </Button>

      </form>
    </AuthLayout>
  );
}

export default Login;
