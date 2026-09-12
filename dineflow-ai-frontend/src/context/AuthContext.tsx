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
  getRefreshToken,
  getStoredUser,
  setAccessToken,
  setRefreshToken,
  setStoredUser,
  clearAuthStorage,
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
    const storedUser =
      getStoredUser<User>();

    const accessToken =
      getAccessToken();

    const refreshToken =
      getRefreshToken();

    /*
     * No stored session.
     */
    if (!storedUser || !accessToken) {
      setUser(null);
      return;
    }

    /*
     * Restore the user immediately.
     */
    setUser(storedUser);

    /*
     * If we have a refresh token, verify that
     * the access token is still usable.
     *
     * We don't have /auth/me in the backend,
     * so we don't make a fake request here.
     */
    if (!refreshToken) {
      return;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshUser();
      } catch {
        clearAuthStorage();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();
  }, []);

  const login = async (
    credentials: LoginCredentials,
  ) => {
    const response =
      await authService.login(
        credentials,
      );

    const data =
      (response as any)?.data ??
      response;

    /*
     * Save access token.
     */
    if (data.accessToken) {
      setAccessToken(
        data.accessToken,
      );
    }

    /*
     * Save refresh token.
     */
    if (data.refreshToken) {
      setRefreshToken(
        data.refreshToken,
      );
    }

    /*
     * Save user in React state AND localStorage.
     */
    if (data.user) {
      setStoredUser<User>(
        data.user,
      );

      setUser(data.user);
    }
  };

  const register = async (
    data: RegisterData,
  ) => {
    const response =
      await authService.register(
        data,
      );

    const result =
      (response as any)?.data ??
      response;

    if (result.accessToken) {
      setAccessToken(
        result.accessToken,
      );
    }

    if (result.refreshToken) {
      setRefreshToken(
        result.refreshToken,
      );
    }

    if (result.user) {
      setStoredUser<User>(
        result.user,
      );

      setUser(result.user);
    }
  };

  const logout = async () => {
    try {
      /*
       * If backend logout fails, we still
       * clear the local session.
       */
      await authService.logout();
    } catch {
      // Local logout should still succeed.
    } finally {
      setUser(null);
      clearAuthStorage();
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