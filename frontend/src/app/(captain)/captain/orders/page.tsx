"use client";

import { CaptainAppShell } from "@/components/layout/captain-app-shell";
import { CaptainTaskCard } from "@/components/captain/captain-task-card";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { useCaptainOrdersDataQuery } from "@/features/captain/captain.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function CaptainOrdersPage() {
  const ordersQuery = useCaptainOrdersDataQuery();

  return (
    <CaptainAppShell>
      <PageContainer title="Assigned Tasks" description="Pickup, deliver, and complete active logistics tasks.">
        <DataState
          isLoading={ordersQuery.isLoading}
          error={getErrorMessage(ordersQuery.error, "")}
          isEmpty={!ordersQuery.data?.length}
          emptyTitle="No captain tasks"
          emptyDescription="Available and accepted delivery tasks will appear here."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {ordersQuery.data?.map((task) => <CaptainTaskCard key={task.id} task={task} basePath="/captain/orders" />)}
          </div>
        </DataState>
      </PageContainer>
    </CaptainAppShell>
  );
}
