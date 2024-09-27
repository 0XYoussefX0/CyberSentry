"use client";

import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type Message = {
  content: string;
  sender_id: string;
  timestamp: string;
  status: "seen" | "sent" | undefined;
};

type MessagesState = {
  messages: {
    [key: string]: Message;
  };
  setMessages: (newMessage: Message, message_id: string) => void;
  updateStatus: (message_id: string, status: Message["status"]) => void;
};

const useMessagesStore = create<MessagesState>((set, get) => ({
  messages: {},

  setMessages: (newMessage, message_id) =>
    set((state) => ({
      messages: { ...state.messages, [message_id]: newMessage },
    })),

  updateStatus: (message_id, status) =>
    set((state) => {
      const updatedMessage = { ...state.messages[message_id] };
      updatedMessage.status = status;
      return {
        messages: {
          ...state.messages,
          [message_id]: updatedMessage,
        },
      };
    }),
}));

export default useMessagesStore;
