"use client";

import { CaptainAppShell } from "@/components/layout/captain-app-shell";
import { PageContainer } from "@/components/shared/page-container";
import { Card } from "@/components/ui/card";
import { useCaptainProfileQuery } from "@/features/captain/captain.hooks";
import { formatCurrency } from "@/lib/utils/format";

export default function CaptainEarningsPage() {
  const profileQuery = useCaptainProfileQuery();

  return (
    <CaptainAppShell>
      <PageContainer title="Earnings" description="Current COD balance held by the captain profile.">
        <Card className="max-w-md">
          <p className="text-sm text-[var(--color-text-muted)]">Cash in hand</p>
          <p className="mt-2 text-3xl font-bold">{formatCurrency(profileQuery.data?.cashInHand || 0)}</p>
        </Card>
      </PageContainer>
    </CaptainAppShell>
  );
}
