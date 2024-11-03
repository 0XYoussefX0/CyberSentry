import React from "react";
import { useRouter } from "next/navigation";

import useCallStore from "@/lib/zustand/callStore";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

function CallModal() {
  const callInfo = useCallStore((state) => state.callInfo);
  const openCallModal = useCallStore((state) => state.openCallModal);
  const setOpenCallModal = useCallStore((state) => state.setOpenCallModal);

  const router = useRouter();
  const acceptCall = () => {
    if (!callInfo) return;
    router.push(`/call?roomID=${callInfo.roomID}`);
  };

  const declineCall = () => {
    // send a message to the server informing it that the user has declined the call, and in the server check if the room only has two people in it, if so then send a message to the other particiapnt informing him that the call has been declined, otherwise if it is a room keep him in the room by himself
  };

  return (
    <Dialog
      open={openCallModal}
      onOpenChange={(v) => {
        if (!v) {
          setOpenCallModal(null, false);
          return;
        }
        setOpenCallModal(callInfo, true);
      }}
    >
      <DialogContent>
        <DialogHeader>
          {callInfo && callInfo.call_type === "one to one" ? (
            <>
              <img src={callInfo.user_avatar_image} alt="" />
              <div>{callInfo.user_name}</div>
            </>
          ) : (
            <div></div>
          )}
          <button onClick={() => acceptCall()}>Accept</button>
          <button onClick={() => declineCall()}>Decline</button>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CallModal;
