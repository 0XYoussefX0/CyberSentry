import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import MessageCard from "@/components/MessageCard";
import MessageInput from "@/components/MessageInput";
import Status from "@/components/Status";

import callIcon from "@/assets/callIcon.svg";
import editIcon from "@/assets/editIcon.svg";
import searchIcon from "@/assets/searchIcon.svg";
import user from "@/assets/user.png";
import verified from "@/assets/verified.svg";
import videocallIcon from "@/assets/videocallIcon.svg";

export default function Messages() {
  return (
    <div className="flex h-screen w-full flex-1">
      <div className="flex h-full w-1/3 flex-col gap-3 border-r border-solid border-r-gray-200 bg-white pt-5">
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
      <div className="flex h-screen w-2/3 flex-col overflow-hidden bg-white">
        <div className="flex justify-between border-b border-solid border-gray-200 px-6 py-5">
          <div className="flex gap-4">
            <div className="relative">
              {/* if the user is verified you show this icon */}
              <img
                src={verified.src}
                alt=""
                className="absolute bottom-0 right-0"
              />
              <img src={user.src} alt="" className="h-14 w-14 rounded-full" />
            </div>
            <div className="flex gap-2">
              <div>
                <div className="text-[18px] font-semibold leading-7 text-gray-900">
                  Katherine Moss
                </div>
                <div className="text-sm text-gray-600">@kathy</div>
              </div>
              <Status online={false} />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              aria-label="call"
              className="rounded-bl-lg rounded-tl-lg border-b border-l border-t border-solid border-gray-300 bg-white px-3 py-2.5"
            >
              <img src={callIcon.src} alt="" />
            </button>
            <div className="h-[42px] w-[1px] border-y border-solid border-gray-300 py-[7px]">
              <div className="h-full w-full rounded-full bg-gray-200"></div>
            </div>
            <button
              aria-label="video call"
              className="rounded-br-lg rounded-tr-lg border-b border-r border-t border-solid border-gray-300 bg-white px-3 py-2.5"
            >
              <img src={videocallIcon.src} alt="" />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-white"></div>
        <MessageInput />
      </div>
    </div>
  );
}
