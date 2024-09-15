import React from "react";

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-[18px] h-3 relative cursor-pointer">
      <span
        className={`absolute  origin-left h-0.5 w-full bg-gray-500 rounded-sm transition-transform ${open ? "-top-[1px] left-[2px] rotate-45" : "rotate-0 top-0 left-0"}`}
      ></span>
      <span
        className={` absolute top-[5px] origin-left h-0.5 bg-gray-500 rounded-sm left-0 rotate-0 transition-all ${open ? "w-0 opacity-0" : "w-2/3 opacity-100"}`}
      ></span>
      <span
        className={`absolute origin-left h-0.5 w-full bg-gray-500 rounded-sm transition-transform ${open ? "top-[11px] left-[2px] -rotate-45" : "rotate-0 top-[10px] left-0"}`}
      ></span>
    </div>
  );
}

export default HamburgerIcon;
