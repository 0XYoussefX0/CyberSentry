import type {
  Dispatch,
  KeyboardEvent,
  MutableRefObject,
  SetStateAction,
} from "react";

import type { InferOutput } from "valibot";
import type { InferIssue } from "valibot";

import type {
  EmailSchema,
  LoginSchema,
  PasswordSchema,
  SignUpSchema,
  profileDetailsFormSchema,
} from "@pentest-app/schemas/client";

import type { Socket } from "socket.io-client";

type Constraints = "length" | "symbol" | "uppercase" | "number";

export type PasswordConstraints = {
  id: Constraints;
  text: string;
}[];

export type EmailSchemaType = InferOutput<typeof EmailSchema>;

export type PasswordSchemaType = InferOutput<typeof PasswordSchema>;

export type SignUpSchemaType = InferOutput<typeof SignUpSchema>;

export type LoginSchemaType = InferOutput<typeof LoginSchema>;

export type ProfileDetailsFormSchemaType = InferOutput<
  typeof profileDetailsFormSchema
>;

export type croppedArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type onCropCompleteType = (
  croppedArea: croppedArea,
  croppedAreaPixels: croppedArea,
) => void;

export type getCroppedImgType = (
  imageSrc: string,
  pixelCrop: croppedArea,
  rotation: number,
  flip?: { horizontal: boolean; vertical: boolean },
) => Promise<Blob | null>;

export type SignUpResponse =
  | { status: "success" }
  | {
      status: "validation_error";
      errors: [
        InferIssue<typeof SignUpSchema>,
        ...InferIssue<typeof SignUpSchema>[],
      ];
    }
  | { status: "server_error"; error: string };

export type LogOutResponse =
  | {
      status: "error";
      error: string;
    }
  | undefined;

export type LoginResponse =
  | undefined
  | {
      status: "validation_error";
      errors: [
        InferIssue<typeof LoginSchema>,
        ...InferIssue<typeof LoginSchema>[],
      ];
    }
  | { status: "server_error"; error: string };

export type ForgotPasswordResponse =
  | { status: "success" }
  | {
      status: "validation_error";
      errors: [
        InferIssue<typeof EmailSchema>,
        ...InferIssue<typeof EmailSchema>[],
      ];
    }
  | { status: "server_error"; error: string };

export type ResetPasswordResponse =
  | undefined
  | { status: "success" }
  | {
      status: "validation_error";
      errors: [
        InferIssue<typeof PasswordSchema>,
        ...InferIssue<typeof PasswordSchema>[],
      ];
    }
  | { status: "server_error"; error: string };

export type CheckEmailModalProps = {
  open: boolean;
  setOpen: Dispatch<
    SetStateAction<{
      email: string;
      open: boolean;
    }>
  >;
  message: string;
  email: string;
};

export type CompleteProfileResponse =
  | undefined
  | { status: "success" }
  | { status: "server_error"; error: string }
  | {
      status: "validation_error";
      errors: [
        InferIssue<typeof profileDetailsFormSchema>,
        ...InferIssue<typeof profileDetailsFormSchema>[],
      ];
    };

export type UserInfo = {
  avatar_image: string;
  name: string;
  user_id: string;
};

export type UserTagProps = {
  name: string;
  index: number;
  avatar_image: string;
  deselectUser: (index: number) => void;
};

export type SuggestionsPopOverProps = {
  suggestions: UserInfo[];
  showSuggestions: boolean;
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
  addSelectedUser: (index: number) => void;
  suggestionsRef: {
    suggestionsContainer: MutableRefObject<HTMLDivElement | null>;
    suggestionsFirstItem: MutableRefObject<HTMLDivElement | null>;
  };
};

export type MentionInputProps = {
  clearInput: boolean;
  selectedUsers: UserInfo[];
  showSuggestions: boolean;
  setClearInput: Dispatch<SetStateAction<boolean>>;
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
  debounceFetchUsers: (query: string) => void;
  deletePreviousSelectedUser: (e: KeyboardEvent<HTMLInputElement>) => void;
};

export type SideBarProps = {
  userImage: string | null;
  userName: string;
  userEmail: string;
};

export type Message = {
  type: "file" | "audio" | "text";
  content: string;
  sender_id: string;
  timestamp: string;
  status: "seen" | "sent" | undefined;
};

export type MessagesState = {
  messages: {
    [key: string]: Message;
  };
  setMessages: (newMessage: Message, messageId: string) => void;
};

export type SocketState = {
  socket: null | Socket;
  intializeSocket: () => Promise<Socket>;
  disconnect: () => void;
};

export type CallStoreState = {
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

export type OpenState = {
  open: boolean;
  setOpen: () => void;
};

export type SideBarTopProps = {
  open: boolean;
  setOpen: () => void;
};

export type BreakPoint = {
  matches: boolean;
  mediaQuery: MediaQueryList;
  listener: () => void;
  label: string;
  mediaQueryValue: string;
  usageCount: number;
};

export type BreakPointInput = Pick<BreakPoint, "label" | "mediaQueryValue">;

export interface ResponsiveBreakPointsState {
  breakpoints: BreakPoint[];
  registerBreakpoints: (breakpoints: BreakPointInput[]) => void;
  unregisterBreakpoints: (breakpoints: BreakPointInput[]) => void;
  getBreakpointValue: (label: string) => boolean | undefined;
}
