"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotificationMutations, useNotificationsQuery } from "@/features/notifications/notification.hooks";
import { getErrorMessage } from "@/lib/utils/errors";
import { formatDateTime } from "@/lib/utils/format";

export default function ShopOwnerNotificationsPage() {
  const notificationsQuery = useNotificationsQuery();
  const mutations = useNotificationMutations();

  return (
    <DashboardShell title="Notifications" navItems={[{ href: "/shop-owner/shops", label: "Shops" }, { href: "/shop-owner/notifications", label: "Notifications" }]}>
      <DataState
        isLoading={notificationsQuery.isLoading}
        error={getErrorMessage(notificationsQuery.error, "")}
        isEmpty={!notificationsQuery.data?.length}
        emptyTitle="No notifications"
        emptyDescription="Order and inventory notifications will appear here."
      >
        <div className="space-y-4">
          {notificationsQuery.data?.map((notification) => (
            <Card key={notification.id} className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{notification.message}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{formatDateTime(notification.createdAt)}</p>
              </div>
              {!notification.isRead ? (
                <Button variant="outline" onClick={() => mutations.markRead.mutate(notification.id)}>
                  Mark Read
                </Button>
              ) : null}
            </Card>
          ))}
        </div>
      </DataState>
    </DashboardShell>
  );
}
