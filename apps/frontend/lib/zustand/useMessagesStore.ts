"use client";

import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type Message = {
  type: "file" | "audio" | "text";
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
};

const useMessagesStore = create<MessagesState>((set, get) => ({
  messages: {},

  setMessages: (newMessage, message_id) =>
    set((state) => {
      return {
        messages: { ...state.messages, [message_id]: newMessage },
      };
    }),
}));

export default useMessagesStore;
