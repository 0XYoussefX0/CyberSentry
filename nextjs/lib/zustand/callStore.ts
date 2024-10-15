"use client";

import { create } from "zustand";

type CallStoreState = {
  openCallModal: boolean;
  callInfo:
    | null
    | {
        call_type: "one to one";
        roomID: string;
        user_name: string;
        user_avatar_image: string;
      }
    | { call_type: "many to many"; room_name: string; roomID: string };
  setOpenCallModal: (
    callInfo: CallStoreState["callInfo"],
    openCallModal: boolean,
  ) => void;
};

const useCallStore = create<CallStoreState>((set, get) => ({
  openCallModal: false,
  callInfo: null,

  setOpenCallModal: (callInfo, openCallModal) =>
    set(() => ({ openCallModal, callInfo })),
}));

export default useCallStore;
