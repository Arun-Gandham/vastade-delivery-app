"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { resolveHomePath } from "@/lib/auth/route-access";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <main className="app-shell flex min-h-screen items-center justify-center py-10">
      <Card className="max-w-lg space-y-4 p-6">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Your account is signed in, but this route is not available for your role. Use the correct dashboard or sign out.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => router.push(resolveHomePath(user?.role))}>Open Dashboard</Button>
          <Button variant="danger" onClick={() => void logout()}>
            Logout
          </Button>
        </div>
      </Card>
    </main>
  );
}
