import { authCookieNames } from "@/lib/auth/cookies";
import type { AuthSession, User } from "@/types/domain";

const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

const clearCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};

export const authStorage = {
  getAccessToken: () => getCookie(authCookieNames.accessToken),
  getRefreshToken: () => getCookie(authCookieNames.refreshToken),
  getRole: () => getCookie(authCookieNames.role),
  getUser: (): User | null => {
    const raw = getCookie(authCookieNames.user);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
  saveSession: (session: AuthSession) => {
    setCookie(authCookieNames.accessToken, session.accessToken);
    setCookie(authCookieNames.refreshToken, session.refreshToken);
    setCookie(authCookieNames.role, session.user.role);
    setCookie(authCookieNames.user, JSON.stringify(session.user));
  },
  clear: () => {
    clearCookie(authCookieNames.accessToken);
    clearCookie(authCookieNames.refreshToken);
    clearCookie(authCookieNames.role);
    clearCookie(authCookieNames.user);
  },
};
