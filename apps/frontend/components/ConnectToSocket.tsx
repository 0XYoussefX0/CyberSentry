"use client";

import { useEffect } from "react";
import { Socket } from "socket.io-client";

import useCallStore from "@/lib/zustand/callStore";
import useSocketStore from "@/lib/zustand/socketStore";
import useMessagesStore from "@/lib/zustand/useMessagesStore";

import CallModal from "@/components/CallModal";

function ConnectToSocket() {
  const intializeSocket = useSocketStore((state) => state.intializeSocket);
  const disconnect = useSocketStore((state) => state.disconnect);

  const setMessages = useMessagesStore((state) => state.setMessages);

  const setOpenCallModal = useCallStore((state) => state.setOpenCallModal);

  useEffect(() => {
    let socket: Socket;
    (async () => {
      socket = await intializeSocket();

      if (socket) {
        socket.on("receiveMessage", (message, message_id) => {
          console.log(message, message_id);
          setMessages(message, message_id);
        });

        socket.on("call", (callinfo) => {
          setOpenCallModal(callinfo, true);
        });
      }
    })();

    return () => {
      if (socket) {
        socket.off("receiveMessage");
        socket.off("call");
      }

      disconnect();
    };
  }, []);

  return (
    <>
      <CallModal />
    </>
  );
}

export default ConnectToSocket;
