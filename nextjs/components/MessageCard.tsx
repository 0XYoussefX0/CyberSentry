import Link from "next/link";

import user from "@/assets/user.png";

function MessageCard() {
  return (
    <Link
      href={`/messages?roomID=sa9azo`}
      className="border-b border-solid border-gray-200"
    >
      <div className="flex w-full flex-col gap-4 p-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-500 h-2 w-2 rounded-full"></div>
            <div className="relative">
              <img
                src={user.src}
                alt=""
                className="h-10 w-10 rounded-full border"
              />
              <div className="bg-success absolute bottom-0 right-0 z-10 h-3 w-3 rounded-full border-[1.5px] border-solid border-white"></div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-semibold text-gray-700">
                Phoenix Baker
              </div>
              <div className="text-sm font-normal text-gray-600">@phoenix</div>
            </div>
          </div>
          <div className="text-sm font-normal text-gray-600">5 min ago</div>
        </div>
        <div className="truncate-message pl-5 text-sm leading-5 text-gray-600">
          Hey Olivia, Katherine sent me over the latest doc. I just have a quick
          question about the whatever zezezzeze ezezeazeaz eazeaeazeaeazeazea
          zeazeaeazeazeza e azeaz eazeazeza
        </div>
      </div>
    </Link>
  );
}

export default MessageCard;
