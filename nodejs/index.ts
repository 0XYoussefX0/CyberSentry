import { Server } from "socket.io";
import { Client, Account, Databases, Query, Models } from "node-appwrite";
import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  CONVERSATIONS_COLLECTION_ID,
  DATABASE_ID,
  USER_CONVERSATIONS_COLLECTION_ID,
  USERS_COLLECTION_ID,
} from "./env";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(cookieParser());

io.use(async (socket, next) => {
  const cookies = socket.handshake.headers.cookie;
  const session = cookies
    ?.split(";")
    .find((c) => c.trim().startsWith("session="))
    ?.split("=")[1];

  if (!session) {
    return next(new Error("invalid session"));
  }

  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT!)
    .setProject(APPWRITE_PROJECT_ID!);

  client.setSession(session);

  const account = new Account(client);
  const database = new Databases(client);

  const user = await account.get();

  if (!user) {
    return next(new Error("invalid session"));
  }

  socket.data.user = user;
  socket.data.database = database;

  next();
});

io.on("connection", async (socket) => {
  const database = socket.data.database as Databases;
  const user = socket.data.user as Models.User<Models.Preferences>;

  const { conversations } = await database.getDocument(
    DATABASE_ID,
    USERS_COLLECTION_ID,
    user.$id
  );

  if (conversations.length > 0) {
    const conversationIDs = conversations.map(
      (conversation: any) => conversation.conversation_info.conversation_id
    );

    socket.join(conversationIDs);
  }

  socket.on("message", (data, cb) => {
    const { roomID, message } = data;

    cb();

    socket.in(roomID).emit("receiveMessage", {
      content: message,
      sender_id: user.$id,
      timestamp: new Date(),
    });
  });

  console.log("a user connected");
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
