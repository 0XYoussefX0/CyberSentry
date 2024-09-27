"use client";

import { useEffect, useState } from "react";

type MessagesLayoutProps = {
  conversationList: React.ReactNode;
  conversationContent: React.ReactNode;
  roomID: string;
};

function MessagesLayout({
  conversationList,
  conversationContent,
  roomID,
}: MessagesLayoutProps) {
  const [widthGT1280, setWidthGT1280] = useState<undefined | boolean>(
    undefined,
  );

  useEffect(() => {
    const mediaQuery = matchMedia("( min-width: 1280px )");

    const handleMediaQueryChange = (
      e: MediaQueryListEvent | MediaQueryList,
    ) => {
      if (e.matches) {
        setWidthGT1280(true);
      } else {
        setWidthGT1280(false);
      }
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    handleMediaQueryChange(mediaQuery);
  }, []);

  if (widthGT1280 === undefined) return;

  return (
    <div className="flex h-screen w-full flex-1">
      <div
        className={`h-full ${widthGT1280 ? "w-1/3" : "w-full"} ${!widthGT1280 && roomID ? "hidden" : ""}`}
      >
        {conversationList}
      </div>
      <div className={` h-screen ${widthGT1280 ? "w-2/3" : "w-full"} `}>
        {roomID && conversationContent}
      </div>
    </div>
  );
}

export default MessagesLayout;

// make the sidebar still not take the screen's width until the screen is at least 1000px wide
