"use client";

import Link from "next/link";
import { CaptainAppShell } from "@/components/layout/captain-app-shell";
import { CaptainTaskCard } from "@/components/captain/captain-task-card";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { apiConfig } from "@/config/api.config";
import {
  useCaptainActiveOrdersQuery,
  useCaptainMutations,
  useCaptainOrdersDataQuery,
  useCaptainProfileQuery
} from "@/features/captain/captain.hooks";
import { useLocation } from "@/hooks/use-location";
import { getErrorMessage } from "@/lib/utils/errors";
import { formatCurrency } from "@/lib/utils/format";

export default function CaptainDashboardPage() {
  const profileQuery = useCaptainProfileQuery();
  const availableOrdersQuery = useCaptainOrdersDataQuery();
  const activeOrdersQuery = useCaptainActiveOrdersQuery();
  const captainMutations = useCaptainMutations();
  const location = useLocation();
  const latitude = profileQuery.data?.currentLatitude ? Number(profileQuery.data.currentLatitude) : null;
  const longitude = profileQuery.data?.currentLongitude ? Number(profileQuery.data.currentLongitude) : null;
  const mapUrl =
    latitude != null && longitude != null
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`
      : null;
  const googleMapsUrl =
    latitude != null && longitude != null
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : null;

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
          <StatCard label="Available Orders" value={availableOrdersQuery.data?.length || 0} />
          <StatCard label="Active Deliveries" value={activeOrdersQuery.data?.length || 0} />
          <StatCard label="Cash In Hand" value={formatCurrency(profileQuery.data?.cashInHand || 0)} />
          <StatCard label="Availability" value={profileQuery.data?.isAvailable ? "Available" : "Busy"} />
          <StatCard
            label="Status"
            value={profileQuery.data?.availabilityStatus || (profileQuery.data?.isOnline ? "ONLINE" : "OFFLINE")}
          />
        </div>
        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="overflow-hidden p-0">
            <div className="border-b border-[var(--color-border)] px-4 py-3">
              <h2 className="text-lg font-semibold">Live Location Map</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Location updates are sent only when you move at least {apiConfig.captainLocationMinChangeMeters} meters while online.
              </p>
            </div>
            {mapUrl ? (
              <iframe
                className="h-[280px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapUrl}
                title="Captain live location map"
              />
            ) : (
              <div className="flex h-[280px] items-center justify-center px-6 text-sm text-[var(--color-text-muted)]">
                Go online and allow location access to load the live map.
              </div>
            )}
          </Card>
          <Card className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Current Coordinates</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Browser geolocation provides the device position. A map API is used only for display.
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-muted)]">Latitude</span>
                <span>{latitude?.toFixed(6) ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-muted)]">Longitude</span>
                <span>{longitude?.toFixed(6) ?? "-"}</span>
              </div>
            </div>
            {googleMapsUrl ? (
              <a
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-muted)]"
                href={googleMapsUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open in Google Maps
              </a>
            ) : null}
          </Card>
        </section>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Orders</h2>
            <Link href="/captain/orders" className="text-sm text-[var(--color-primary)]">
              View all
            </Link>
          </div>
          <DataState
            isLoading={availableOrdersQuery.isLoading}
            error={getErrorMessage(availableOrdersQuery.error, "")}
            isEmpty={!availableOrdersQuery.data?.length}
            emptyTitle="No available orders"
            emptyDescription="Accepted shop orders will appear here in real time."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {availableOrdersQuery.data?.map((task) => (
                <CaptainTaskCard key={task.orderId} task={task} basePath="/captain/orders" />
              ))}
            </div>
          </DataState>
        </section>
      </PageContainer>
    </CaptainAppShell>
  );
}
