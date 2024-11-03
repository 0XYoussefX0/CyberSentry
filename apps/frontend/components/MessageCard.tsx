import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { randomColor } from "@/lib/utils";

type MessageCardProps = {
  conversation_id: string;
  room_name: string | null;
  participants: something[];
  last_message: string;
  last_message_timestamp: string;
};

function MessageCard({
  conversation_id,
  room_name,
  participants,
  last_message,
  last_message_timestamp,
}: MessageCardProps) {
  const [{ avatar_image, name }] = participants;

  const timeAgo = formatDistanceToNow(last_message_timestamp, {
    addSuffix: true,
  });

  return (
    <Link
      href={`/messages?roomID=${conversation_id}`}
      className="border-b border-solid p-4 border-b-gray-200"
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-500 h-2 w-2 rounded-full"></div>
            <div className="relative">
              {room_name ? (
                <div
                  className={`h-10 w-10 text-white flex items-center justify-center bg-[${randomColor()}] rounded-full border`}
                >
                  {room_name.split("")[0].toUpperCase()}
                </div>
              ) : (
                <img
                  src={avatar_image}
                  alt=""
                  className="h-10 w-10 rounded-full border"
                />
              )}
              <div className="bg-success absolute bottom-0 right-0 z-10 h-3 w-3 rounded-full border-[1.5px] border-solid border-white"></div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-semibold text-gray-700">
                {room_name ? room_name : name}
              </div>
              {!room_name && (
                <div className="text-sm font-normal text-gray-600">
                  {"@" + name.split(" ")[0].toLowerCase()}
                </div>
              )}
            </div>
          </div>
          <div className="text-sm font-normal text-gray-600">{timeAgo}</div>
        </div>
        <div className="truncate-message pl-5 text-sm leading-5 text-gray-600">
          {last_message}
        </div>
      </div>
    </Link>
  );
}

export default MessageCard;
