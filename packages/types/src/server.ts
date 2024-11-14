import type { DB } from "@pentest-app/db/drizzle";
import type { sessionTable, userTable } from "@pentest-app/db/user";
import type { InferSelectModel } from "drizzle-orm";
import type { Client } from "minio";

import type { EnvSchema } from "@pentest-app/schemas/server";
import type { InferOutput } from "valibot";

import type {
  Consumer,
  Producer,
  Router,
  WebRtcTransport,
} from "mediasoup/node/lib/types.js";

import type { AppData } from "mediasoup/node/lib/types.js";

import type { Socket } from "socket.io";

import type { Resend } from "resend";
import type { AuthService, Cookies } from "./global.js";

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;

export type SessionValidationResult =
  | { session: Session; user: User }
  | {
      session: null;
      user: null;
    };

export type Context = {
  isProduction: boolean;
  minioHost: string;
  minio: Client;
  db: DB;
  resend: Resend;
  auth: AuthService;
  ENCRYPTION_KEY: Buffer;
  cookies: Cookies;
};

export type Env = InferOutput<typeof EnvSchema>;

export type Rooms = {
  [key: string]: {
    router: Router<AppData>;
    peers: string[];
  };
};

export type Transports = {
  socketID: string;
  transport: WebRtcTransport<AppData>;
  roomID: string;
  consumer: boolean;
}[];

export type Peers = {
  [key: string]: {
    roomID: string;
    socket: Socket;
    transports: string[];
    producers: string[];
    consumers: string[];
    peerDetails: {
      name: string;
      avatar_image: string;
    };
  };
};

export type Producers = {
  socketID: string;
  roomID: string;
  producer: Producer<AppData>;
  user_id: string;
}[];

export type Consumers = {
  socketID: string;
  consumer: Consumer<AppData>;
  roomID: string;
}[];
