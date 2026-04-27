"use client";

import { useCallback, useState } from "react";
import { apiConfig } from "@/config/api.config";

type Coordinates = {
  latitude: number;
  longitude: number;
};

export const useLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);

  const requestLocation = useCallback(
    () =>
      new Promise<Coordinates>((resolve, reject) => {
        if (!navigator.geolocation) {
          const message = "Location is not supported on this device.";
          setError(message);
          reject(new Error(message));
          return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLoading(false);
            setError(null);
            setCurrentLocation(coords);
            resolve(coords);
          },
          () => {
            const message = "Location permission denied. Please allow access and try again.";
            setLoading(false);
            setError(message);
            reject(new Error(message));
          }
        );
      }),
    []
  );

  const watchLocation = useCallback(
    (onChange: (coords: Coordinates) => void) => {
      if (!navigator.geolocation) {
        const message = "Location is not supported on this device.";
        setError(message);
        return null;
      }

      setLoading(true);

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setLoading(false);
          setError(null);
          setCurrentLocation(coords);
          onChange(coords);
        },
        () => {
          const message = "Location permission denied. Please allow access and try again.";
          setLoading(false);
          setError(message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: apiConfig.captainLocationMaximumAgeMs,
          timeout: apiConfig.captainLocationTimeoutMs,
        }
      );

      return watchId;
    },
    []
  );

  const clearLocationWatch = useCallback((watchId: number | null) => {
    if (watchId != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return { requestLocation, watchLocation, clearLocationWatch, currentLocation, loading, error };
};
