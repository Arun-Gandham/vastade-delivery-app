"use client";

import { CaptainAppShell } from "@/components/layout/captain-app-shell";
import { CaptainTaskCard } from "@/components/captain/captain-task-card";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { useCaptainActiveOrdersQuery, useCaptainOrdersDataQuery } from "@/features/captain/captain.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function CaptainOrdersPage() {
  const availableOrdersQuery = useCaptainOrdersDataQuery();
  const activeOrdersQuery = useCaptainActiveOrdersQuery();

  return (
    <CaptainAppShell>
      <PageContainer title="Captain Orders" description="Accept available work and complete your assigned deliveries.">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Available Orders</h2>
          <DataState
            isLoading={availableOrdersQuery.isLoading}
            error={getErrorMessage(availableOrdersQuery.error, "")}
            isEmpty={!availableOrdersQuery.data?.length}
            emptyTitle="No available orders"
            emptyDescription="Accepted shop orders will appear here."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {availableOrdersQuery.data?.map((task) => (
                <CaptainTaskCard key={task.orderId} task={task} basePath="/captain/orders" />
              ))}
            </div>
          </DataState>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Active Deliveries</h2>
          <DataState
            isLoading={activeOrdersQuery.isLoading}
            error={getErrorMessage(activeOrdersQuery.error, "")}
            isEmpty={!activeOrdersQuery.data?.length}
            emptyTitle="No active deliveries"
            emptyDescription="Accepted and in-progress deliveries will appear here."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {activeOrdersQuery.data?.map((task) => (
                <CaptainTaskCard key={task.orderId} task={task} basePath="/captain/orders" />
              ))}
            </div>
          </DataState>
        </section>
      </PageContainer>
    </CaptainAppShell>
  );
}
