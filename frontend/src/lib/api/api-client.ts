import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { apiConfig } from "@/config/api.config";
import { authStorage } from "@/lib/storage/auth-storage";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";
import type { AuthSession, User } from "@/types/domain";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
type RefreshTokenPayload = {
  accessToken: string;
  refreshToken: string;
};

const api = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  withCredentials: true,
});

let refreshingPromise: Promise<AuthSession> | null = null;

const normalizeError = (error: AxiosError<ApiErrorResponse>) => {
  const payload = error.response?.data;
  const message = error.response
    ? payload?.message || error.message || "Something went wrong"
    : `Cannot reach backend API at ${apiConfig.baseURL}. Check that the backend server is running.`;
  return {
    message,
    errorCode: payload?.errorCode,
    errors: payload?.errors || [],
    status: error.response?.status,
  };
};

const refreshSession = async () => {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) {
    authStorage.clear();
    throw {
      message: "Your session has expired. Please log in again.",
      status: 401,
      errorCode: "AUTH_REFRESH_TOKEN_MISSING",
      errors: [],
    };
  }

  const currentUser = authStorage.getUser();
  if (!currentUser) {
    authStorage.clear();
    throw {
      message: "Your session data is incomplete. Please log in again.",
      status: 401,
      errorCode: "AUTH_USER_MISSING",
      errors: [],
    };
  }

  const response = await axios.post<ApiSuccessResponse<RefreshTokenPayload>>(
    `${apiConfig.baseURL}/auth/refresh-token`,
    { refreshToken },
    { withCredentials: true, timeout: apiConfig.timeout }
  );

  const session: AuthSession = {
    ...response.data.data,
    user: currentUser,
  };

  authStorage.saveSession(session);
  return session;
};

api.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryConfig | undefined;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        refreshingPromise ??= refreshSession();
        const session = await refreshingPromise;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        authStorage.clear();
        return Promise.reject(
          typeof refreshError === "object" && refreshError
            ? refreshError
            : {
                message: "Your session has expired. Please log in again.",
                status: 401,
                errorCode: "AUTH_REFRESH_FAILED",
                errors: [],
              }
        );
      } finally {
        refreshingPromise = null;
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

export const unwrapResponse = async <T>(promise: Promise<{ data: ApiSuccessResponse<T> }>) => {
  const response = await promise;
  return response.data.data;
};

export default api;
