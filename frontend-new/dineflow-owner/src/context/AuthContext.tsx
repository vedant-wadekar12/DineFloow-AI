import { createContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import type { AuthContextType, LoginCredentials, RegisterData, User, UserRole } from "@/types/auth.types";
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

function normalizeUser(value: unknown): User | null {
  if (!isRecord(value)) return null;

  const id =
    typeof value.id === "string"
      ? value.id
      : typeof value._id === "string"
        ? value._id
        : undefined;

  if (!id) return null;

  const roleName = typeof value.roleName === "string" ? value.roleName : undefined;
  const role = typeof value.role === "string" ? value.role : roleName;
  const roles = Array.isArray(value.roles)
    ? value.roles.filter((item): item is UserRole => typeof item === "string")
    : role
      ? [role as UserRole]
      : undefined;

  return {
    id,
    email: typeof value.email === "string" ? value.email : "",
    firstName: typeof value.firstName === "string" ? value.firstName : undefined,
    lastName: typeof value.lastName === "string" ? value.lastName : undefined,
    name:
      typeof value.name === "string"
        ? value.name
        : [value.firstName, value.lastName]
            .filter((item): item is string => typeof item === "string" && item.length > 0)
            .join(" ") || undefined,
    role: role as UserRole | undefined,
    roles,
    permissions: Array.isArray(value.permissions)
      ? value.permissions.filter((item): item is string => typeof item === "string")
      : undefined,
    emailVerified:
      typeof value.emailVerified === "boolean"
        ? value.emailVerified
        : typeof value.isVerified === "boolean"
          ? value.isVerified
          : undefined,
    restaurantId: typeof value.restaurantId === "string" ? value.restaurantId : undefined,
    branchId: typeof value.branchId === "string" ? value.branchId : undefined,
    avatar: typeof value.avatar === "string" ? value.avatar : undefined,
  };
}

function readUser(value: unknown): User | null {
  const envelope = readAuthEnvelope(value);
  if (envelope.user) {
    const normalized = normalizeUser(envelope.user);
    if (normalized) return normalized;
  }

  return normalizeUser(value);
}

function normalizeStoredUser(): User | null {
  const stored = getStoredUser<unknown>();
  if (!stored) return null;

  const normalized = normalizeUser(stored);
  if (normalized) {
    setStoredUser(normalized);
  }

  return normalized;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = Boolean(user);

  const refreshUser = async () => {
    const storedUser = normalizeStoredUser();
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

    // The backend login response uses MongoDB `_id` and `roleName`.
    // Normalize that response before storing it so the role guard never sees
    // a valid RESTAURANT_OWNER as ROLE_NOT_RETURNED.
    const loginUser = auth.user ? normalizeUser(auth.user) : null;

    if (loginUser) {
      setStoredUser(loginUser);
      setUser(loginUser);
    }

    try {
      const currentUser = await authService.getCurrentUser();
      const normalizedUser = readUser(currentUser);

      if (normalizedUser) {
        setStoredUser(normalizedUser);
        setUser(normalizedUser);
      } else if (loginUser) {
        // `/auth/me` may return a response envelope that differs from login.
        // Keep the already validated login identity instead of replacing it
        // with an empty/role-less user.
        setStoredUser(loginUser);
        setUser(loginUser);
      }
    } catch (error) {
      // Login already succeeded. Keep the normalized login identity if the
      // follow-up `/auth/me` request temporarily fails.
      if (!loginUser) throw error;
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
