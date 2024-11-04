import { createServer } from "node:http";
import cookieParser from "cookie-parser";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";

import mediasoup from "mediasoup";

import type {
  AppData,
  RtpCodecCapability,
  WebRtcTransportOptions,
} from "mediasoup/node/lib/types.js";

import type {
  Consumers,
  Peers,
  Producers,
  Rooms,
  Transports,
} from "@pentest-app/types/server";

import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { getDb } from "@pentest-app/db/drizzle";
import { appRouter } from "@pentest-app/trpc/router";
import type { Context } from "@pentest-app/types/server";

import { getMinio } from "@pentest-app/minio/index";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import { createAuthService } from "@pentest-app/auth/index";
import { env } from "./env.js";

// const redis = await createClient()
//   .on("error", (err) => console.log("Redis Client Error", err))
//   .connect();

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});
app.use(cookieParser());

const handleRequest = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.get("Origin");

  if (origin === null || origin !== `https://${env.DOMAIN_NAME}`) {
    return res.status(403).json({ message: "Access forbidden" });
  }

  next();
};

if (env.NODE_ENV === "production") {
  app.use(handleRequest);
}

const db = await getDb(env.DATABASE_URL);
const auth = createAuthService(db);

app.use(auth.checkAuth);

const isProduction = env.NODE_ENV === "production";

const minio = getMinio({
  endPoint: isProduction ? "s3_storage" : "localhost",
  port: 9000,
  useSSL: isProduction,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

if (!minio) {
  console.error("❌ Minio failed to initialize");
  process.exit(1);
}

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }: CreateExpressContextOptions): Context => {
      return {
        isProduction,
        minioHost: env.MINIO_HOST_URL,
        minio,
        db,
        res,
      };
    },
  }),
);

const server = createServer(app);

const adminCredentials = {
  email: env.ADMIN_APP_EMAIL,
  password: env.ADMIN_APP_PASSWORD,
  role: env.ADMIN_APP_ROLE,
  username: env.ADMIN_APP_USERNAME,
  tag: env.ADMIN_APP_TAG,
};

auth.signTheAdminUp(adminCredentials);

const worker = await mediasoup.createWorker({
  rtcMinPort: 10000,
  rtcMaxPort: 10100,
});

worker.on("died", (error) => {
  console.error("mediasoup worker has died");
  setTimeout(() => process.exit(1), 2000);
});

const io = new Server(server, {
  cors: {
    origin: isProduction
      ? `https://${env.DOMAIN_NAME}`
      : "http://localhost:3000",
    credentials: true,
  },
});

const rooms: Rooms = {};
const peers: Peers = {};
const transports: Transports = [];
const producers: Producers = [];
const consumers: Consumers = [];

const mediaCodecs: RtpCodecCapability[] = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: {
      "x-google-start-bitrate": 1000,
    },
  },
];

const webRtcTransport_options: WebRtcTransportOptions<AppData> = {
  listenIps: [
    {
      ip: env.SERVER_PUBLIC_IP,
      announcedIp: env.SERVER_PUBLIC_IP,
    },
  ],
  enableUdp: true,
  enableTcp: false,
  preferUdp: true,
};

app.use(cookieParser());

// const client = new Client()
//   .setEndpoint(APPWRITE_ENDPOINT!)
//   .setProject(APPWRITE_PROJECT_ID!)
//   .setKey(APPWRITE_API_KEY!);

// const databases = new Databases(client);

// io.use(async (socket, next) => {
//   const cookies = socket.handshake.headers.cookie;
//   const session = cookies
//     ?.split(";")
//     .find((c) => c.trim().startsWith("session="))
//     ?.split("=")[1];

//   if (!session) {
//     return next(new Error("invalid session"));
//   }

//   // const client = new Client()
//   //   .setEndpoint(APPWRITE_ENDPOINT!)
//   //   .setProject(APPWRITE_PROJECT_ID!);

//   client.setSession(session);

//   const account = new Account(client);
//   const database = new Databases(client);

//   const user = await account.get();

//   if (!user) {
//     return next(new Error("invalid session"));
//   }

//   socket.data.user = user;
//   socket.data.database = database;

//   next();
// });

// io.on("connection", async (socket) => {

//   const user = socket.data.user as Models.User<Models.Preferences>;

//   // redis.SADD(user.$id, socket.id);

//   io.to("").emit("user_has_connected", () => {});

//   // socket.on("disconnect", () => {
//   //   redis.SREM(user.$id, socket.id);
//   // });

//   const database = socket.data.database as Databases;

//   const { conversations } = await database.getDocument(
//     DATABASE_ID,
//     USERS_COLLECTION_ID,
//     user.$id
//   );

//   if (conversations.length > 0) {
//     const conversationIDs = conversations.map(
//       (conversation: any) => conversation.conversation_info.conversation_id
//     );

//     socket.join(conversationIDs);
//   }

//   socket.on("message", (data) => {
//     const { roomID, messageContent, message_id } = data;

//     io.to(roomID).emit(
//       "receiveMessage",
//       {
//         content: messageContent,
//         sender_id: user.$id,
//         timestamp: new Date(),
//         status: "sent",
//       },
//       message_id
//     );
//   });

//   // async function informOtherUsers(roomID) {
//   //   // this might need to be rewritten we are already storing the sockets of the people that are inside the room in the server

//   //   const { participants, room_name, room_type } = await databases.getDocument(
//   //     DATABASE_ID,
//   //     CONVERSATIONS_COLLECTION_ID,
//   //     roomID,
//   //     [Query.select(["participants", "room_name"])]
//   //   );

//   //   const remainingParticipantsIds = participants.filter(
//   //     (participantID) => participantID !== user.$id
//   //   );

//   //   const onlineParticipantsSockets = [];
//   //   let offlineParticipants = [];

//   //   remainingParticipantsIds.forEach(async (participantID) => {
//   //     const participantSocketIDs = await redis.SMEMBERS(participantID);
//   //     if (participantSocketIDs.length > 0) {
//   //       onlineParticipantsSockets.push(...participantSocketIDs);
//   //     } else {
//   //       offlineParticipants.push(participantID);
//   //     }
//   //   });

//   //   let user_avatar_image;
//   //   if (remainingParticipantsIds === 1) {
//   //     const { avatar_image } = await databases.getDocument(
//   //       DATABASE_ID,
//   //       USERS_COLLECTION_ID,
//   //       user.$id,
//   //       [Query.select(["avatar_image"])]
//   //     );
//   //     user_avatar_image = avatar_image;
//   //   }

//   //   io.to(onlineParticipantsSockets).emit(
//   //     "call",
//   //     room_type === "one to one"
//   //       ? {
//   //           call_type: "one to one",
//   //           roomID,
//   //           user_name: user.name,
//   //           user_avatar_image,
//   //         }
//   //       : { call_type: "many to many", roomID, room_name }
//   //   );

//   //   if (offlineParticipants.length > 0) {
//   //     const startTime = new Date();
//   //     const intervalID = setInterval(async () => {
//   //       const currentTime = new Date();
//   //       const elapsedTime =
//   //         (currentTime.getTime() - startTime.getTime()) / 1000;

//   //       if (offlineParticipants.length === 0) {
//   //         clearInterval(intervalID);
//   //         return;
//   //       }

//   //       if (elapsedTime >= 30) {
//   //         if (room_type === "one to one" && offlineParticipants.length === 1) {
//   //           socket.emit("end_call");
//   //         }
//   //         clearInterval(intervalID);
//   //         return;
//   //       }

//   //       const reconnectedParticipantIdx: number[] = [];
//   //       for (let i = 0; i < offlineParticipants.length; i++) {
//   //         const participantID = offlineParticipants[i];
//   //         const participantSocketIDs = await redis.SMEMBERS(participantID);

//   //         if (participantSocketIDs.length > 0) {
//   //           reconnectedParticipantIdx.push(i);
//   //           io.to(participantSocketIDs).emit(
//   //             "call",
//   //             room_type === "one to one"
//   //               ? {
//   //                   call_type: "one to one",
//   //                   roomID,
//   //                   user_name: user.name,
//   //                   user_avatar_image,
//   //                 }
//   //               : { call_type: "many to many", roomID, room_name }
//   //           );
//   //         }
//   //       }

//   //       offlineParticipants = offlineParticipants.filter(
//   //         (_, i) => !reconnectedParticipantIdx.includes(i)
//   //       );
//   //     }, 2000);
//   //   }
//   // }

//   // socket.on("joinCallRoom", async ({ roomID, socketID }, callback) => {
//   //   if (rooms[roomID]) {
//   //     const router = rooms[roomID].router;
//   //     rooms[roomID].peers = [...rooms[roomID].peers, socketID];
//   //   } else {
//   //     const roomID = "222"; // change this value to a fucntion that creates unique ids and will ensure that there are no conflicts

//   //     const router = await worker.createRouter({ mediaCodecs });

//   //     rooms[roomID] = {
//   //       router,
//   //       peers: [socketID],
//   //     };

//   //     peers[socket.id] = {
//   //       socket,
//   //       roomID,
//   //       transports: [],
//   //       producers: [],
//   //       consumers: [],
//   //       peerDetails: {
//   //         name: "",
//   //         // avatar image maybe ??
//   //         avatar_image: "",
//   //       },
//   //     };

//   //     const rtpCapabilities = router.rtpCapabilities;

//   //     callback({ rtpCapabilities });
//   //   }
//   // });

//   // const addTransport = (
//   //   transport: WebRtcTransport<AppData>,
//   //   roomID: string,
//   //   consumer: boolean
//   // ) => {
//   //   transports = [
//   //     ...transports,
//   //     { socketID: socket.id, transport, roomID, consumer },
//   //   ];

//   //   peers[socket.id] = {
//   //     ...peers[socket.id],
//   //     transports: [...peers[socket.id].transports, transport.id],
//   //   };
//   // };

//   // socket.on("createWebRtcTransport", async ({ consumer }, callback) => {
//   //   const roomID = peers[socket.id].roomID;

//   //   const router = rooms[roomID].router;

//   //   try {
//   //     let transport = await router.createWebRtcTransport(
//   //       webRtcTransport_options
//   //     );

//   //     console.log(`transport id: ${transport.id}`);

//   //     transport.on("dtlsstatechange", (dtlsState) => {
//   //       if (dtlsState === "closed") {
//   //         transport.close();
//   //       }
//   //     });

//   //     transport.on("@close", () => {
//   //       console.log("transport closed");
//   //     });

//   //     callback({
//   //       id: transport.id,
//   //       iceParameters: transport.iceParameters,
//   //       iceCandidates: transport.iceCandidates,
//   //       dtlsParameters: transport.dtlsParameters,
//   //     });

//   //     addTransport(transport, roomID, consumer);
//   //   } catch (error) {
//   //     console.log(error);
//   //     callback({ error });
//   //   }
//   // });

//   // const addProducer = (producer: Producer<AppData>, roomID: string) => {
//   //   producers = [
//   //     ...producers,
//   //     { socketID: socket.id, producer, roomID, user_id: user.$id },
//   //   ];

//   //   peers[socket.id] = {
//   //     ...peers[socket.id],
//   //     producers: [...peers[socket.id].producers, producer.id],
//   //   };
//   // };

//   // const getTransport = (socketID: string) => {
//   //   const [producerTransport] = transports.filter(
//   //     (transport) => transport.socketID === socketID && !transport.consumer
//   //   );

//   //   return producerTransport.transport;
//   // };

//   // const informConsumers = (
//   //   roomID: string,
//   //   socketID: string,
//   //   producerID: string
//   // ) => {
//   //   producers.forEach((producerData) => {
//   //     if (
//   //       producerData.socketID !== socketID &&
//   //       producerData.roomID === roomID
//   //     ) {
//   //       const producerSocket = peers[producerData.socketID].socket;

//   //       producerSocket.emit("new-producer", { producerID });
//   //     }
//   //   });
//   // };

//   // socket.on("getProducers", (callback) => {
//   //   const { roomID } = peers[socket.id];

//   //   let producerList: string[] = [];

//   //   producers.forEach((producerData) => {
//   //     if (
//   //       producerData.socketID !== socket.id &&
//   //       producerData.roomID === roomID
//   //     ) {
//   //       producerList = [...producerList, producerData.producer.id];
//   //     }
//   //   });

//   //   callback(producerList);
//   // });

//   // socket.on("transport-connect", async ({ dtlsParameters }, callback) => {
//   //   console.log("DTLS PARAMS... ", { dtlsParameters });

//   //   const transport = getTransport(socket.id);
//   //   await transport.connect({ dtlsParameters });
//   //   callback();
//   // });

//   // socket.on(
//   //   "transport-produce",
//   //   async ({ kind, rtpParameters, appData }, callback) => {
//   //     const transport = getTransport(socket.id);
//   //     const producer = await transport.produce({
//   //       kind,
//   //       rtpParameters,
//   //     });

//   //     const { roomID } = peers[socket.id];

//   //     addProducer(producer, roomID);

//   //     informConsumers(roomID, socket.id, producer.id);

//   //     producer.on("transportclose", () => {
//   //       producer.close();
//   //     });

//   //     // producersExist should check if there are producers in the room that the user is in, not if there are producers overall, because that will return true for the mostpart in a production env
//   //     callback({
//   //       id: producer.id,
//   //       producersExist: producers.length > 1 ? true : false,
//   //     });
//   //   }
//   // );

//   // const addConsumer = (consumer: Consumer<AppData>, roomID: string) => {
//   //   consumers = [...consumers, { socketID: socket.id, consumer, roomID }];

//   //   peers[socket.id] = {
//   //     ...peers[socket.id],
//   //     consumers: [...peers[socket.id].consumers, consumer.id],
//   //   };
//   // };

//   // socket.on(
//   //   "consume",
//   //   async (
//   //     { rtpCapabilities, remoteProducerID, serverConsumerTransportID },
//   //     callback
//   //   ) => {
//   //     try {
//   //       const { roomID } = peers[socket.id];

//   //       const router = rooms[roomID].router;

//   //       const consumerTransportData = transports.find(
//   //         (transportData) =>
//   //           transportData.consumer &&
//   //           transportData.transport.id === serverConsumerTransportID
//   //       );

//   //       if (!consumerTransportData) return;

//   //       let consumerTransport = consumerTransportData.transport;

//   //       if (
//   //         router.canConsume({ producerId: remoteProducerID, rtpCapabilities })
//   //       ) {
//   //         const consumer = await consumerTransport.consume({
//   //           producerId: remoteProducerID,
//   //           rtpCapabilities,
//   //           paused: true,
//   //         });

//   //         consumer.on("transportclose", () => {
//   //           console.log("transport close from consumer");
//   //         });

//   //         consumer.on("producerclose", () => {
//   //           console.log("producer of consumer closed");
//   //           socket.emit("producer-closed", { remoteProducerID });

//   //           consumerTransport.close();
//   //           transports = transports.filter(
//   //             (transportData) =>
//   //               transportData.transport.id !== consumerTransport.id
//   //           );
//   //           consumer.close();
//   //           consumers = consumers.filter(
//   //             (consumerData) => consumerData.consumer.id !== consumer.id
//   //           );

//   //           addConsumer(consumer, roomID);

//   //           const params = {
//   //             id: consumer.id,
//   //             kind: consumer.kind,
//   //             rtpParameters: consumer.rtpParameters,
//   //             serverConsumerId: consumer.id,
//   //           };

//   //           callback(params);
//   //         });
//   //       }
//   //     } catch (error) {
//   //       console.log(error.message);
//   //       callback({
//   //         error,
//   //       });
//   //     }
//   //   }
//   // );

//   // socket.on(
//   //   "transport-recv-connect",
//   //   async ({ dtlsParameters, serverConsumerTransportID }, callback) => {
//   //     const transportData = transports.find(
//   //       (transportData) =>
//   //         transportData.consumer &&
//   //         transportData.transport.id === serverConsumerTransportID
//   //     );

//   //     if (transportData) {
//   //       const consumerTransport = transportData.transport;
//   //       await consumerTransport.connect({ dtlsParameters });
//   //       callback();
//   //     }
//   //   }
//   // );
// });

// informOtherUsers

server.listen(4000, () => {
  console.log("listening on *:4000");
});
