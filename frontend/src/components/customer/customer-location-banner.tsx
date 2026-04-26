"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const CustomerLocationBanner = ({
  loading,
  error,
  onUseLocation,
}: {
  loading: boolean;
  error?: string | null;
  onUseLocation: () => void;
}) => (
  <Card className="flex flex-col gap-3 border-[rgba(31,157,85,0.18)] bg-[linear-gradient(135deg,rgba(31,157,85,0.08),rgba(240,140,0,0.05))]">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">Location</p>
      <h3 className="mt-1 text-lg font-semibold">Use your current location for faster local store discovery</h3>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        We use your live location to personalize delivery context and update your saved delivery address for checkout.
      </p>
    </div>
    {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
    <div>
      <Button onClick={onUseLocation} loading={loading}>
        Use Current Location
      </Button>
    </div>
  </Card>
);
