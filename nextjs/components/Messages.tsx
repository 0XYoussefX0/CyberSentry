"use client";

import { format } from "date-fns";

import useMessagesStore from "@/lib/zustand/useMessagesStore";

import { CheckMark } from "@/components/icons/CheckMark";
import { DoubleCheckMark } from "@/components/icons/DoubleCheckMark";
import { LoadingSpinner } from "@/components/icons/LoadingSpinner";

function Messages({ userID }: { userID: string }) {
  const messages = useMessagesStore((state) => state.messages);

  return (
    <div className="flex-1 flex flex-col gap-4 bg-white p-6">
      {Object.keys(messages).map((message_id) => {
        const { content, sender_id, timestamp, status } = messages[message_id];

        const messageIsMine = sender_id === userID;
        const senderIsOnline = true;

        return (
          <div
            key={message_id}
            className={`flex gap-1.5 flex-col ${messageIsMine ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[50%] ${messageIsMine ? "items-end" : "items-start"} w-full flex gap-1.5 flex-col`}
            >
              <div className="font-medium text-sm text-gray-700 ">
                {messageIsMine ? "You" : "Someone else"}
              </div>

              <div
                className={`flex max-w-full min-w-[100px] justify-end items-end gap-6 flex-wrap rounded-lg py-2.5 px-3.5 ${messageIsMine ? "text-white rounded-tr-none bg-brand-600 " : "rounded-tl-none text-gray-900 bg-[#F9FAFB] border border-solid border-gray-200"}`}
              >
                <div className="max-w-full break-words">{content}</div>
                <div
                  className={`text-xs flex gap-2 ${messageIsMine ? "text-gray-100" : "text-gray-500"}`}
                >
                  {format(new Date(timestamp), "hh:mm a")}
                  {messageIsMine && (
                    <div>
                      {status === "seen" ? (
                        <DoubleCheckMark color="#7CD4FD" />
                      ) : status === "sent" && senderIsOnline ? (
                        <DoubleCheckMark color="#D1D5DB" />
                      ) : status === "sent" ? (
                        <CheckMark />
                      ) : (
                        <LoadingSpinner />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Messages;
