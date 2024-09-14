import React from "react";

function Status({ online }: { online: boolean }) {
  return (
    <div className="shadow-xs mt-[3px] flex h-[22px] items-center justify-center gap-1 rounded-md border border-solid border-gray-300 pl-[6px] pr-[5px]">
      <div
        className={`h-1.5 w-1.5 rounded-full ${online ? "bg-success" : "bg-gray-300"}`}
      ></div>
      <div className="text-xs font-medium leading-[18px] text-gray-700">
        {online ? "Online" : "Offline"}
      </div>
    </div>
  );
}

export default Status;
