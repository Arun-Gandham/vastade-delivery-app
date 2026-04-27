"use client";

import Link from "next/link";
import { CaptainAppShell } from "@/components/layout/captain-app-shell";
import { CaptainTaskCard } from "@/components/captain/captain-task-card";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { useCaptainMutations, useCaptainOrdersDataQuery, useCaptainProfileQuery } from "@/features/captain/captain.hooks";
import { useLocation } from "@/hooks/use-location";
import { getErrorMessage } from "@/lib/utils/errors";
import { formatCurrency } from "@/lib/utils/format";

export default function CaptainDashboardPage() {
  const profileQuery = useCaptainProfileQuery();
  const ordersQuery = useCaptainOrdersDataQuery();
  const captainMutations = useCaptainMutations();
  const location = useLocation();

  const toggleOnline = async () => {
    const coords = profileQuery.data?.isOnline
      ? { latitude: undefined, longitude: undefined }
      : await location.requestLocation().catch(() => ({ latitude: undefined, longitude: undefined }));

    await captainMutations.updateOnlineStatus.mutateAsync({
      isOnline: !profileQuery.data?.isOnline,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  };

  return (
    <CaptainAppShell>
      <PageContainer
        title="Captain Dashboard"
        description="Stay available, track assigned orders, and close COD deliveries."
        actions={
          <Button
            variant={profileQuery.data?.isOnline ? "success" : "outline"}
            loading={captainMutations.updateOnlineStatus.isPending || location.loading}
            onClick={() => void toggleOnline()}
          >
            {profileQuery.data?.isOnline ? "Online" : "Go Online"}
          </Button>
        }
      >
        <div className="dashboard-grid">
          <StatCard label="Active Tasks" value={ordersQuery.data?.length || 0} />
          <StatCard label="Cash In Hand" value={formatCurrency(profileQuery.data?.cashInHand || 0)} />
          <StatCard label="Availability" value={profileQuery.data?.isAvailable ? "Available" : "Busy"} />
          <StatCard label="Status" value={profileQuery.data?.availabilityStatus || (profileQuery.data?.isOnline ? "ONLINE" : "OFFLINE")} />
        </div>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Tasks</h2>
            <Link href="/captain/orders" className="text-sm text-[var(--color-primary)]">
              View all
            </Link>
          </div>
          <DataState
            isLoading={ordersQuery.isLoading}
            error={getErrorMessage(ordersQuery.error, "")}
            isEmpty={!ordersQuery.data?.length}
            emptyTitle="No delivery tasks"
            emptyDescription="Task offers and assigned deliveries will appear here."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {ordersQuery.data?.map((task) => <CaptainTaskCard key={task.id} task={task} basePath="/captain/orders" />)}
            </div>
          </DataState>
        </section>
      </PageContainer>
    </CaptainAppShell>
  );
}
