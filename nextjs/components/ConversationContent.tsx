import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

import { createSessionClient, getUser } from "@/lib/appwrite/server";
import {
  CONVERSATIONS_COLLECTION_ID,
  DATABASE_ID,
  USERS_COLLECTION_ID,
} from "@/lib/env";

import CallButton from "@/components/CallButton";
import Status from "@/components/icons/Status";
import MessageInput from "@/components/MessageInput";
import Messages from "@/components/Messages";
import VideoCallButton from "@/components/VideoCallButton";

import callIcon from "@/assets/callIcon.svg";
import user from "@/assets/user.png";
import verified from "@/assets/verified.svg";
import videocallIcon from "@/assets/videocallIcon.svg";

async function ConversationContent({ roomID }: { roomID: string }) {
  if (!roomID) return;
  const { account, databases } = await createSessionClient();

  const user = await getUser(account);

  if (!user) redirect("/login");

  const { documents } = await databases.listDocuments(
    DATABASE_ID,
    CONVERSATIONS_COLLECTION_ID,
    [Query.equal("conversation_id", roomID)],
  );

  const conversation_info = documents[0];

  const room_name = conversation_info.room_name;
  const participants = conversation_info.participants;

  let participantData;

  if (!room_name) {
    const [paricipant] = participants.filter(
      (participant: string) => participant !== user.$id,
    );
    const { documents } = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("user_id", paricipant)],
    );
    participantData = documents[0];
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <div className="flex justify-between border-b border-solid border-gray-200 px-6 py-5">
        <div className="flex gap-4">
          <div className="relative">
            {room_name ? (
              <div className="h-14 w-14 rounded-full">
                {room_name.split("")[0].toUpperCase()}
              </div>
            ) : (
              <>
                {participantData.verified && (
                  <img
                    src={verified.src}
                    alt=""
                    className="absolute bottom-0 right-0"
                  />
                )}
                <img
                  src={participantData.avatar_image}
                  alt=""
                  className="h-14 w-14 rounded-full"
                />
              </>
            )}
          </div>
          <div className="flex gap-2">
            <div>
              <div className="text-[18px] font-semibold leading-7 text-gray-900">
                {room_name ? room_name : participantData.name}
              </div>
              {!room_name && (
                <div className="text-sm text-gray-600">
                  {" "}
                  {"@" + participantData.name.split(" ")[0].toLowerCase()}
                </div>
              )}
            </div>
            {!room_name && <Status online={false} />}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <CallButton roomID={roomID} />
          <div className="h-[42px] w-[1px] border-y border-solid border-gray-300 py-[7px]">
            <div className="h-full w-full rounded-full bg-gray-200"></div>
          </div>
          <VideoCallButton roomID={roomID} />
        </div>
      </div>
      <Messages userID={user.$id} />
      <MessageInput roomID={roomID} userID={user.$id} />
    </div>
  );
}

export default ConversationContent;
