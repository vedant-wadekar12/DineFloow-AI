import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import axios from "axios";

import { normalizeUser } from "@/utils/normalize-user";

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

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

interface TokenResponse {
  accessToken?: string;
  refreshToken?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

/**
 * Safely extracts access/refresh tokens from different
 * backend response envelope formats.
 *
 * Supported examples:
 *
 * {
 *   accessToken: "...",
 *   refreshToken: "..."
 * }
 *
 * or
 *
 * {
 *   data: {
 *     accessToken: "...",
 *     refreshToken: "..."
 *   }
 * }
 */
function readTokenResponse(value: unknown): {
  accessToken?: string;
  refreshToken?: string;
} {
  if (!value || typeof value !== "object") {
    return {};
  }

  const response = value as TokenResponse;

  const nested =
    response.data && typeof response.data === "object"
      ? response.data
      : undefined;

  return {
    accessToken:
      nested?.accessToken ??
      response.accessToken,

    refreshToken:
      nested?.refreshToken ??
      response.refreshToken,
  };
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  /**
   * Loads the authenticated user from the backend.
   *
   * Backend endpoint:
   * GET /api/v1/auth/me
   *
   * The backend is the source of truth for:
   * - user ID
   * - email
   * - role
   * - role ID
   * - restaurant ID
   * - branch ID
   * - permissions
   * - account status
   */
  const refreshUser = async (): Promise<void> => {
    const storedUser = getStoredUser<User>();

    const accessToken = getAccessToken();

    const refreshToken = getRefreshToken();

    /*
     * Nothing exists locally.
     * There is no authenticated session to restore.
     */
    if (!storedUser && !accessToken && !refreshToken) {
      setUser(null);
      return;
    }

    /*
     * Restore the locally cached user immediately.
     *
     * This allows the UI to remain usable while /auth/me
     * is being requested.
     */
    if (storedUser) {
      setUser(storedUser);
    }

    /*
     * If the access token is missing but a refresh token exists,
     * attempt to obtain a new access token first.
     */
    if (!accessToken && refreshToken) {
      try {
        const refreshed = await authService.refreshToken();

        const tokens = readTokenResponse(refreshed);

        if (tokens.accessToken) {
          setAccessToken(tokens.accessToken);
        }

        if (tokens.refreshToken) {
          setRefreshToken(tokens.refreshToken);
        }
      } catch (error: unknown) {
        /*
         * Refresh failed.
         *
         * Clear authentication because the refresh token
         * can no longer establish a valid session.
         */
        clearAuthStorage();
        setUser(null);

        throw error;
      }
    }

    try {
      /*
       * Always ask the backend for the current authenticated user.
       *
       * Do NOT trust the stored user's role/permissions as the
       * final source of truth.
       */
      const currentUser = await authService.getCurrentUser();

      /*
       * Convert the backend user format into the frontend
       * User type.
       *
       * Example backend response:
       *
       * {
       *   data: {
       *     _id: "...",
       *     email: "...",
       *     roleId: "...",
       *     roleName: "RESTAURANT_OWNER",
       *     restaurantId: "..."
       *   }
       * }
       */
      const normalizedUser = normalizeUser(currentUser);

      /*
       * Save the normalized user locally.
       */
      setStoredUser<User>(normalizedUser);

      /*
       * Update React authentication state.
       */
      setUser(normalizedUser);
    } catch (error: unknown) {
      /*
       * 401 / 403 means the backend rejected the session.
       *
       * The local session must therefore be removed.
       */
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 ||
          error.response?.status === 403)
      ) {
        clearAuthStorage();

        setUser(null);

        throw error;
      }

      /*
       * For temporary network/server problems:
       *
       * If a valid stored user exists, keep the locally restored
       * session rather than immediately logging the user out.
       *
       * If there is no stored user, propagate the error.
       */
      if (!storedUser) {
        throw error;
      }
    }
  };

  /**
   * Restore authentication state when the application starts.
   */
  useEffect(() => {
    let mounted = true;

    void refreshUser()
      .catch(() => {
        if (mounted && !getStoredUser<User>()) {
          setUser(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Login user.
   *
   * Flow:
   *
   * 1. Send email/password to backend.
   * 2. Save access/refresh tokens.
   * 3. Call /auth/me.
   * 4. Normalize backend user.
   * 5. Store authenticated user.
   * 6. Return authenticated user.
   */
  const login = async (
    credentials: LoginCredentials,
  ): Promise<User> => {
    /*
     * Backend login.
     */
    const response = await authService.login(credentials);

    /*
     * Extract tokens regardless of whether the backend
     * returns them directly or inside `data`.
     */
    const tokens = readTokenResponse(response);

    /*
     * Store access token.
     */
    if (tokens.accessToken) {
      setAccessToken(tokens.accessToken);
    }

    /*
     * Store refresh token.
     */
    if (tokens.refreshToken) {
      setRefreshToken(tokens.refreshToken);
    }

    /*
     * Do NOT trust a user object returned from login if
     * /auth/me is available.
     *
     * Ask the backend for the current authenticated user.
     */
    const currentUser = await authService.getCurrentUser();

    /*
     * Convert backend user into the frontend User model.
     */
    const normalizedUser = normalizeUser(currentUser);

    /*
     * Persist authenticated user.
     */
    setStoredUser<User>(normalizedUser);

    /*
     * Update React state.
     */
    setUser(normalizedUser);

    /*
     * AuthContext requires login() to return User.
     */
    return normalizedUser;
  };

  /**
   * Register a new account.
   */
  const register = async (
    data: RegisterData,
  ): Promise<void> => {
    await authService.register(data);
  };

  /**
   * Logout user.
   *
   * Backend logout is attempted first.
   * Local authentication is cleared regardless of
   * whether the backend logout request succeeds.
   */
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
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