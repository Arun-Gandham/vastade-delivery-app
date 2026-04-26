import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center py-10">
      <Card className="max-w-lg space-y-4 p-6">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          This route is reserved for future backend support. In the current MVP, resets are handled through the support team rather than a token-based web flow.
        </p>
        <Link href="/support">
          <Button>Open support details</Button>
        </Link>
      </Card>
    </main>
  );
}
