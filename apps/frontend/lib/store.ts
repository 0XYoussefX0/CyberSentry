"use client";

import type {
  BreakPoint,
  CallStoreState,
  MessagesState,
  OpenState,
  ResponsiveBreakPointsState,
  SocketState,
} from "@pentest-app/types/client";
import { io } from "socket.io-client";
import { create } from "zustand";

export const useCallStore = create<CallStoreState>((set, get) => ({
  openCallModal: false,
  callInfo: null,

  setOpenCallModal: (callInfo, openCallModal) =>
    set(() => ({ openCallModal, callInfo })),
}));

export const useSocketStore = create<SocketState>((set, get) => ({
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

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messages: {},

  setMessages: (newMessage, messageId) =>
    set((state) => {
      return {
        messages: { ...state.messages, [messageId]: newMessage },
      };
    }),
}));

export const useOpenStore = create<OpenState>((set) => ({
  open: false,
  setOpen: () =>
    set(({ open: prevOpen }) => {
      return {
        open: !prevOpen,
      };
    }),
}));

export const useResponsiveBreakPointsStore = create<ResponsiveBreakPointsState>(
  (set, get) => ({
    breakpoints: [],

    registerBreakpoints: (newBreakpoints) => {
      const currentBreakpoints = get().breakpoints;
      const updatedBreakpoints = [...currentBreakpoints];

      for (const { label, mediaQueryValue } of newBreakpoints) {
        const existingIndex = updatedBreakpoints.findIndex(
          (bp) => bp.mediaQueryValue === mediaQueryValue,
        );

        if (existingIndex !== -1) {
          updatedBreakpoints[existingIndex].usageCount++;
        } else {
          const mediaQuery = window.matchMedia(mediaQueryValue);
          const listener = () => {
            set((state) => ({
              breakpoints: state.breakpoints.map((bp) =>
                bp.mediaQueryValue === mediaQueryValue
                  ? { ...bp, matches: mediaQuery.matches }
                  : bp,
              ),
            }));
          };

          mediaQuery.addEventListener("change", listener);

          updatedBreakpoints.push({
            label,
            mediaQueryValue,
            mediaQuery,
            listener,
            matches: mediaQuery.matches,
            usageCount: 1,
          });
        }
      }

      set({ breakpoints: updatedBreakpoints });
    },

    unregisterBreakpoints: (breakpointsToRemove) => {
      const currentBreakpoints = get().breakpoints;
      const updatedBreakpoints = currentBreakpoints.reduce<BreakPoint[]>(
        (acc, bp) => {
          const shouldUnregister = breakpointsToRemove.some(
            (removeBp) => removeBp.mediaQueryValue === bp.mediaQueryValue,
          );

          if (shouldUnregister) {
            if (bp.usageCount > 1) {
              acc.push({ ...bp, usageCount: bp.usageCount - 1 });
            } else {
              bp.mediaQuery.removeEventListener("change", bp.listener);
            }
          } else {
            acc.push(bp);
          }

          return acc;
        },
        [],
      );

      set({ breakpoints: updatedBreakpoints });
    },

    getBreakpointValue: (label) => {
      return get().breakpoints.find((bp) => bp.label === label)?.matches;
    },
  }),
);
