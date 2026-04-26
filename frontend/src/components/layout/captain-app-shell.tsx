import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { CaptainBottomNav } from "@/components/layout/captain-bottom-nav";

export const CaptainAppShell = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute>
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(31,157,85,0.08),_transparent_28%),linear-gradient(180deg,#f7fafc_0%,#f5f7fb_100%)]">
      {children}
    </div>
    <CaptainBottomNav />
  </ProtectedRoute>
);
