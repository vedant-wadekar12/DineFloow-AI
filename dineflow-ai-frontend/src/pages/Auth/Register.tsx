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

const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .email("Enter a valid email"),

    phone: z
      .string()
      .trim()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long"),

    password: z
      .string()
      .min(
        8,
        "Password must contain at least 8 characters",
      ),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

type RegisterFormData =
  z.infer<typeof registerSchema>;

function Register() {
  const navigate = useNavigate();

  const { register: registerUser } =
    useAuth();

  const [serverError, setServerError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (
    data: RegisterFormData,
  ) => {
    try {
      setLoading(true);
      setServerError("");

      await registerUser(data);

      navigate("/dashboard");
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ??
          "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Start managing your restaurant with DineFlow AI."
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>First name</Label>

            <Input
              {...register("firstName")}
              className="mt-2"
              placeholder="John"
            />

            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label>Last name</Label>

            <Input
              {...register("lastName")}
              className="mt-2"
              placeholder="Doe"
            />

            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Email</Label>

          <Input
            {...register("email")}
            type="email"
            className="mt-2"
            placeholder="you@example.com"
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label>Phone number</Label>

          <Input
            {...register("phone")}
            type="tel"
            className="mt-2"
            placeholder="9876543210"
          />

          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <Label>Password</Label>

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
          className="w-full bg-[#FF6B35] hover:bg-[#e85d2d]"
          disabled={loading}
        >
          {loading
            ? "Creating account..."
            : "Create Account"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#FF6B35]"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;