"use client";

import { io, type Socket } from "socket.io-client";
import { apiConfig } from "@/config/api.config";

let socket: Socket | null = null;

const resolveSocketUrl = () => {
  try {
    const url = new URL(apiConfig.baseURL);
    return url.origin;
  } catch {
    return apiConfig.baseURL.replace(/\/api\/v1\/?$/, "");
  }
};

export const getRealtimeSocket = (token: string) => {
  if (!socket) {
    socket = io(resolveSocketUrl(), {
      autoConnect: false,
      transports: ["websocket"],
      auth: {
        token
      }
    });
  } else {
    socket.auth = { token };
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectRealtimeSocket = () => {
  socket?.disconnect();
};
