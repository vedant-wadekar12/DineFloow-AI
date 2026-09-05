import apiClient from "@/services/api/api-client";

import type {
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  AuthResponse,
  User,
} from "@/types/auth.types";

export async function login(
  credentials: LoginCredentials,
) {
  const response = await apiClient.post<AuthResponse>(
    "/auth/login",
    credentials,
  );

  return response.data;
}

export async function register(
  data: RegisterData,
) {
  const response = await apiClient.post<AuthResponse>(
    "/auth/register",
    data,
  );

  return response.data;
}

export async function logout() {
  const response = await apiClient.post(
    "/auth/logout",
  );

  return response.data;
}

export async function refreshToken() {
  const response =
    await apiClient.post<AuthResponse>(
      "/auth/refresh-token",
    );

  return response.data;
}

export async function getCurrentUser() {
  const response =
    await apiClient.get<User>("/auth/me");

  return response.data;
}

export async function forgotPassword(
  data: ForgotPasswordData,
) {
  const response = await apiClient.post(
    "/auth/forgot-password",
    data,
  );

  return response.data;
}

export async function resetPassword(
  data: ResetPasswordData,
) {
  const response = await apiClient.post(
    "/auth/reset-password",
    data,
  );

  return response.data;
}

export async function verifyEmail(
  token: string,
) {
  const response = await apiClient.post(
    "/auth/verify-email",
    { token },
  );

  return response.data;
}