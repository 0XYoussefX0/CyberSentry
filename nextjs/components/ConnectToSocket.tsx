"use client";

import { useEffect } from "react";
import { Socket } from "socket.io-client";

import useSocketStore from "@/lib/zustand/socketStore";
import useMessagesStore from "@/lib/zustand/useMessagesStore";

function ConnectToSocket() {
  const intializeSocket = useSocketStore((state) => state.intializeSocket);
  const disconnect = useSocketStore((state) => state.disconnect);

  const setMessages = useMessagesStore((state) => state.setMessages);

  useEffect(() => {
    let socket: Socket;
    (async () => {
      socket = await intializeSocket();

      if (socket) {
        socket.on("receiveMessage", (message) => {
          setMessages(message);
        });
      }
    })();

    return () => {
      if (socket) {
        socket.off("receiveMessage"); // This ensures no duplicate listeners
      }

      disconnect();
    };
  }, []);

  return null;
}

export default ConnectToSocket;
