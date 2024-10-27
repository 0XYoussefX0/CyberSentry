"use client";

import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type SocketState = {
  socket: null | Socket;
  intializeSocket: () => Promise<Socket>;
  disconnect: () => void;
};

const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,

  intializeSocket: async () => {
    return new Promise((resolve) => {
      const socket = io("http://localhost:3001/ws", {
        withCredentials: true,
      });

      socket.on("connect", () => {
        console.log("Connected to WebSocket");
        resolve(socket);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket");
      });

      set({ socket });
    });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({ socket: null });
  },
}));

export default useSocketStore;
