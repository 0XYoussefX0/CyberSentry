import MessageInput from "@/components/MessageInput";
import Status from "@/components/Status";

import callIcon from "@/assets/callIcon.svg";
import user from "@/assets/user.png";
import verified from "@/assets/verified.svg";
import videocallIcon from "@/assets/videocallIcon.svg";

function ConversationContent() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
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
  );
}

export default ConversationContent;
