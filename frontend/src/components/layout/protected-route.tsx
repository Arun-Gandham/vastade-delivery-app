"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { canAccessPath } from "@/lib/auth/route-access";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { ReactNode } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (!loading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!loading && user && !canAccessPath(pathname, user.role)) {
      router.replace("/unauthorized");
    }
  }, [isAuthenticated, loading, mounted, pathname, router, user]);

  if (!mounted || loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <LoadingSpinner label="Checking access..." />
      </div>
    );
  }

  if (!isAuthenticated || (user && !canAccessPath(pathname, user.role))) {
    return null;
  }

  return <>{children}</>;
};
