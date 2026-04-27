import { useEffect, useRef, type ReactNode } from "react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { CaptainBottomNav } from "@/components/layout/captain-bottom-nav";
import { apiConfig } from "@/config/api.config";
import { useCaptainMutations, useCaptainProfileQuery } from "@/features/captain/captain.hooks";
import { useCaptainRealtime } from "@/features/captain/use-captain-realtime";
import { useLocation } from "@/hooks/use-location";

const toRadians = (value: number) => (value * Math.PI) / 180;

const distanceInMeters = (
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
) => {
  const earthRadius = 6_371_000;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const CaptainAppShell = ({ children }: { children: ReactNode }) => {
  const realtime = useCaptainRealtime();

  const profileQuery = useCaptainProfileQuery();
  const captainMutations = useCaptainMutations();
  const updateLocationMutation = captainMutations.updateLocation;
  const { watchLocation, clearLocationWatch } = useLocation();
  const locationDeniedRef = useRef(false);
  const lastSentLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const updateLocationPendingRef = useRef(false);
  const updateLocationMutateRef = useRef(updateLocationMutation.mutate);

  useEffect(() => {
    updateLocationPendingRef.current = updateLocationMutation.isPending;
  }, [updateLocationMutation.isPending]);

  useEffect(() => {
    updateLocationMutateRef.current = updateLocationMutation.mutate;
  }, [updateLocationMutation.mutate]);

  useEffect(() => {
    if (!profileQuery.data?.isOnline || locationDeniedRef.current) {
      clearLocationWatch(watchIdRef.current);
      watchIdRef.current = null;
      lastSentLocationRef.current = null;
      return;
    }

    const watchId = watchLocation((coords) => {
      const lastSent = lastSentLocationRef.current;
      if (updateLocationPendingRef.current) {
        return;
      }

      if (
        lastSent &&
        distanceInMeters(lastSent, coords) < apiConfig.captainLocationMinChangeMeters
      ) {
        return;
      }

      lastSentLocationRef.current = coords;
      updateLocationMutateRef.current({
        latitude: coords.latitude,
        longitude: coords.longitude
      });
    });

    if (watchId == null) {
      locationDeniedRef.current = true;
      return;
    }

    watchIdRef.current = watchId;

    return () => {
      clearLocationWatch(watchId);
      watchIdRef.current = null;
    };
  }, [clearLocationWatch, profileQuery.data?.isOnline, watchLocation]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(31,157,85,0.08),_transparent_28%),linear-gradient(180deg,#f7fafc_0%,#f5f7fb_100%)]">
        <div className="fixed right-4 top-4 z-40 rounded-full border border-[var(--color-border)] bg-white/90 px-3 py-1 text-xs font-medium text-[var(--color-text-muted)] shadow-sm backdrop-blur">
          Socket: {realtime.isConnected ? "Connected" : "Disconnected"}
        </div>
        {children}
      </div>
      <CaptainBottomNav />
    </ProtectedRoute>
  );
};
