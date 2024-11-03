import { redirect } from "next/navigation";

import {
  createSessionClient,
  getUser,
  getUserConversations,
} from "@/lib/appwrite/server";

import { Input } from "@/components/ui/Input";
import AddRoomModal from "@/components/CreateRoomModal";
import MessageCard from "@/components/MessageCard";

import searchIcon from "@/assets/searchIcon.svg";

async function ConversationList() {
  const { account } = await createSessionClient();
  const user = await getUser(account);

  if (!user) redirect("/login");

  const { error, conversations, total_unread_messages } =
    await getUserConversations(user.$id);

  if (error) redirect(`/error?errorMessage=${error}`);

  return (
    <div className="flex h-full w-full flex-col gap-3 border-r border-solid border-r-gray-200 bg-white pt-5">
      <div className="flex justify-between px-6">
        <div className="flex items-center gap-2 py-3">
          <h1 className="text-[18px] font-semibold leading-7 text-gray-900">
            Messages
          </h1>
          <p className="rounded-md border border-solid border-gray-300 px-[5px] py-[1px] text-xs font-medium leading-[18px] text-gray-700 shadow-xs">
            {total_unread_messages ?? 0}
          </p>
        </div>
        <AddRoomModal />
      </div>
      <form className="w-full px-4 pt-2">
        <div className="relative">
          <img
            src={searchIcon.src}
            alt=""
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
          />
          <Input type="text" placeholder="Search" className="w-full pl-10" />
        </div>
      </form>
      <div className="h-full flex flex-col overflow-y-auto">
        {conversations.map(
          ({
            conversation_info: { conversation_id, room_name },
            participants,
            last_message,
            last_message_timestamp,
          }) => (
            <MessageCard
              key={conversation_id}
              conversation_id={conversation_id}
              participants={participants}
              room_name={room_name}
              last_message={last_message}
              last_message_timestamp={last_message_timestamp}
            />
          ),
        )}
      </div>
    </div>
  );
}

export default ConversationList;
