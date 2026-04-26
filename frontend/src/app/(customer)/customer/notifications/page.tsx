"use client";

import { CustomerAppShell } from "@/components/layout/customer-app-shell";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotificationMutations, useNotificationsQuery } from "@/features/notifications/notification.hooks";
import { getErrorMessage } from "@/lib/utils/errors";
import { formatDateTime } from "@/lib/utils/format";

export default function CustomerNotificationsPage() {
  const notificationsQuery = useNotificationsQuery();
  const notificationMutations = useNotificationMutations();

  return (
    <CustomerAppShell>
      <PageContainer title="Notifications" description="Order, delivery, and account alerts from the backend.">
        <DataState
          isLoading={notificationsQuery.isLoading}
          error={getErrorMessage(notificationsQuery.error, "")}
          isEmpty={!notificationsQuery.data?.length}
          emptyTitle="No notifications"
          emptyDescription="Notifications will appear as orders and account events happen."
        >
          <div className="space-y-4">
            {notificationsQuery.data?.map((notification) => (
              <Card key={notification.id} className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">{notification.message}</p>
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">{formatDateTime(notification.createdAt)}</p>
                </div>
                {!notification.isRead ? (
                  <Button variant="outline" onClick={() => notificationMutations.markRead.mutate(notification.id)}>
                    Mark Read
                  </Button>
                ) : null}
              </Card>
            ))}
          </div>
        </DataState>
      </PageContainer>
    </CustomerAppShell>
  );
}
