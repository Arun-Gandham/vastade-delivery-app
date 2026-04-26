import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiConfig } from "@/config/api.config";

export default function ForgotPasswordPage() {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center py-10">
      <Card className="max-w-lg space-y-4 p-6">
        <h1 className="text-2xl font-bold">Password recovery</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Self-service password recovery is not exposed by the current backend. Contact support to verify your account and reset credentials.
        </p>
        <div className="text-sm text-[var(--color-text-muted)]">
          <p>Phone: {apiConfig.supportPhone}</p>
          <p>Email: {apiConfig.supportEmail}</p>
        </div>
        <Link href="/login">
          <Button>Back to login</Button>
        </Link>
      </Card>
    </main>
  );
}
