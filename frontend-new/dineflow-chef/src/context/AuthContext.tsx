import { createContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import type { AuthContextType, LoginCredentials, RegisterData, User } from "@/types/auth.types";
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

type AuthEnvelope = {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  data?: AuthEnvelope;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readAuthEnvelope(value: unknown): AuthEnvelope {
  if (!isRecord(value)) return {};
  const nested = isRecord(value.data) ? value.data : undefined;
  const source = nested ?? value;

  return {
    user: isRecord(source.user) ? (source.user as unknown as User) : undefined,
    accessToken: typeof source.accessToken === "string" ? source.accessToken : undefined,
    refreshToken: typeof source.refreshToken === "string" ? source.refreshToken : undefined,
  };
}

function readUser(value: unknown): User | null {
  const envelope = readAuthEnvelope(value);
  if (envelope.user?.id) return envelope.user;
  if (isRecord(value) && typeof value.id === "string") return value as unknown as User;
  return null;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = Boolean(user);

  const refreshUser = async () => {
    const storedUser = getStoredUser<User>();
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!storedUser && !accessToken && !refreshToken) {
      setUser(null);
      return;
    }

    if (storedUser) setUser(storedUser);

    if (!accessToken && refreshToken) {
      const refreshed = await authService.refreshToken();
      const auth = readAuthEnvelope(refreshed);
      if (auth.accessToken) setAccessToken(auth.accessToken);
      if (auth.refreshToken) setRefreshToken(auth.refreshToken);
    }

    try {
      const currentUser = await authService.getCurrentUser();
      const normalizedUser = readUser(currentUser);

      if (normalizedUser) {
        setStoredUser(normalizedUser);
        setUser(normalizedUser);
      }
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        clearAuthStorage();
        setUser(null);
        throw error;
      }

      // Keep a locally restored session during a temporary network outage.
      if (!storedUser) throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    void refreshUser()
      .catch(() => {
        if (mounted && !getStoredUser<User>()) setUser(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    const auth = readAuthEnvelope(response);

    if (auth.accessToken) setAccessToken(auth.accessToken);
    if (auth.refreshToken) setRefreshToken(auth.refreshToken);

    if (auth.user) {
      setStoredUser(auth.user);
      setUser(auth.user);
    }

    const currentUser = await authService.getCurrentUser();
    const normalizedUser = readUser(currentUser);

    if (normalizedUser) {
      setStoredUser(normalizedUser);
      setUser(normalizedUser);
    }
  };

  const register = async (data: RegisterData) => {
    await authService.register(data);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      clearAuthStorage();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
