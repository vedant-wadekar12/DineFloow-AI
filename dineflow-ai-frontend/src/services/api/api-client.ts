import axios from "axios";

import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  removeStoredUser,
  setAccessToken,
  setRefreshToken,
} from "@/utils/token.utils";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;

type RetryableRequestConfig = {
  _retry?: boolean;
};

type RefreshResponse = {
  accessToken?: string;
  refreshToken?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
};

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config as
        | (typeof error.config &
            RetryableRequestConfig)
        | undefined;

    const status = error.response?.status;

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const requestUrl =
      originalRequest.url ?? "";

    if (
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    const refreshToken =
      getRefreshToken();

    if (!refreshToken) {
      removeAccessToken();
      removeRefreshToken();
      removeStoredUser();

      if (
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    if (isRefreshing) {
      return Promise.reject(error);
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const response =
        await axios.post<RefreshResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {
            refreshToken,
          },
          {
            headers: {
              "Content-Type":
                "application/json",
            },
            withCredentials: true,
          },
        );

      const responseData =
        response.data?.data ??
        response.data;

      const newAccessToken =
        responseData.accessToken;

      const newRefreshToken =
        responseData.refreshToken;

      if (!newAccessToken) {
        throw new Error(
          "Refresh response did not contain an access token.",
        );
      }

      setAccessToken(newAccessToken);

      if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
      }

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      removeAccessToken();
      removeRefreshToken();
      removeStoredUser();

      if (
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;