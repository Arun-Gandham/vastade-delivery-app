"use client";

import { useState } from "react";

export const useLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () =>
    new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        const message = "Location is not supported on this device.";
        setError(message);
        reject(new Error(message));
        return;
      }

      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          setError(null);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          const message = "Location permission denied. Please allow access and try again.";
          setLoading(false);
          setError(message);
          reject(new Error(message));
        }
      );
    });

  return { requestLocation, loading, error };
};
