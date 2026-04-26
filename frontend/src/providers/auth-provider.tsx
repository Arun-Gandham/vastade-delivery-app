"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { queryKeys } from "@/constants/query-keys";
import { getDefaultRouteForRole } from "@/config/routes.config";
import { authApi } from "@/features/auth/auth.api";
import { authStorage } from "@/lib/storage/auth-storage";
import type { AuthSession, User } from "@/types/domain";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(authStorage.getUser());

  const profileQuery = useQuery({
    queryKey: queryKeys.authUser,
    queryFn: authApi.getMe,
    enabled: Boolean(authStorage.getAccessToken()),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (profileQuery.data) {
      setUser(profileQuery.data);
    }
  }, [profileQuery.data]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading: profileQuery.isLoading,
      isAuthenticated: Boolean(user && authStorage.getAccessToken()),
      setSession: (session) => {
        authStorage.saveSession(session);
        setUser(session.user);
      },
      logout: async () => {
        const refreshToken = authStorage.getRefreshToken();
        try {
          if (refreshToken) {
            await authApi.logout(refreshToken);
          }
        } finally {
          authStorage.clear();
          setUser(null);
          if (typeof window !== "undefined") {
            window.location.href = getDefaultRouteForRole(undefined);
          }
        }
      },
    }),
    [profileQuery.isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
