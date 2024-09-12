import React from "react";

function CheckMark({ success }: { success: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="2"
        width="18"
        height="18"
        rx="9"
        fill={success ? "#32D583" : "#D0D5DD"}
        className="transition-colors duration-300"
      />
      <path
        d="M6.875 11L9.625 13.75L15.125 8.25004M20.1667 11C20.1667 16.0627 16.0626 20.1667 11 20.1667C5.93739 20.1667 1.83333 16.0627 1.83333 11C1.83333 5.93743 5.93739 1.83337 11 1.83337C16.0626 1.83337 20.1667 5.93743 20.1667 11Z"
        stroke="white"
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="2"
        y="2"
        width="18"
        height="18"
        rx="9"
        stroke={success ? "#32D583" : "#D0D5DD"}
        className="transition-colors duration-300"
        strokeWidth="2"
      />
    </svg>
  );
}

export default CheckMark;
