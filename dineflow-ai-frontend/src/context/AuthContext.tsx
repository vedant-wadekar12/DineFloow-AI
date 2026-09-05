import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  AuthContextType,
  LoginCredentials,
  RegisterData,
  User,
} from "@/types/auth.types";

import * as authService from "@/services/api/auth/auth.service";

import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/utils/token.utils";

export const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const isAuthenticated = Boolean(user);

  const refreshUser = async () => {
    try {
      const response =
        await authService.getCurrentUser();

      const currentUser =
        (response as any)?.data ??
        response;

      setUser(currentUser);
    } catch {
      setUser(null);
      removeAccessToken();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAccessToken();

        if (token) {
          await refreshUser();
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    credentials: LoginCredentials,
  ) => {
    const response =
      await authService.login(credentials);

    const data =
      (response as any)?.data ??
      response;

    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }

    setUser(data.user);
  };

  const register = async (
    data: RegisterData,
  ) => {
    const response =
      await authService.register(data);

    const result =
      (response as any)?.data ??
      response;

    if (result.accessToken) {
      setAccessToken(result.accessToken);
    }

    if (result.user) {
      setUser(result.user);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      removeAccessToken();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}