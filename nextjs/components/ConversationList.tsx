import { Input } from "@/components/ui/Input";
import MessageCard from "@/components/MessageCard";

import editIcon from "@/assets/editIcon.svg";
import searchIcon from "@/assets/searchIcon.svg";

function ConversationList() {
  return (
    <div className="flex h-full w-full flex-col gap-3 border-r border-solid border-r-gray-200 bg-white pt-5">
      <div className="flex justify-between px-6">
        <div className="flex items-center gap-2 py-3">
          <h1 className="text-[18px] font-semibold leading-7 text-gray-900">
            Messages
          </h1>
          <p className="rounded-md border border-solid border-gray-300 px-[5px] py-[1px] text-xs font-medium leading-[18px] text-gray-700 shadow-xs">
            40
          </p>
        </div>
        <button
          aria-label="Create Something idk, i have to change this label"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-solid border-gray-300 bg-white shadow-xs"
        >
          <img src={editIcon.src} alt="" />
        </button>
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
      <div className="h-full overflow-auto">
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
      </div>
    </div>
  );
}

export default ConversationList;
