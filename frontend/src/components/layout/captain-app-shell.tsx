import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { CaptainBottomNav } from "@/components/layout/captain-bottom-nav";

export const CaptainAppShell = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute>
    {children}
    <CaptainBottomNav />
  </ProtectedRoute>
);
