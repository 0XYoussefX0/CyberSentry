"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const node_appwrite_1 = require("node-appwrite");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./env");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});
app.use((0, cookie_parser_1.default)());
io.use(async (socket, next) => {
    var _a;
    const cookies = socket.handshake.headers.cookie;
    const session = (_a = cookies === null || cookies === void 0 ? void 0 : cookies.split(";").find((c) => c.trim().startsWith("session="))) === null || _a === void 0 ? void 0 : _a.split("=")[1];
    if (!session) {
        return next(new Error("invalid session"));
    }
    const client = new node_appwrite_1.Client()
        .setEndpoint(env_1.APPWRITE_ENDPOINT)
        .setProject(env_1.APPWRITE_PROJECT_ID);
    client.setSession(session);
    const account = new node_appwrite_1.Account(client);
    const database = new node_appwrite_1.Databases(client);
    const user = await account.get();
    if (!user) {
        return next(new Error("invalid session"));
    }
    socket.data.user = user;
    socket.data.database = database;
    next();
});
io.on("connection", async (socket) => {
    const database = socket.data.database;
    const user = socket.data.user;
    const { conversations } = await database.getDocument(env_1.DATABASE_ID, env_1.USERS_COLLECTION_ID, user.$id);
    if (conversations.length > 0) {
        const conversationIDs = conversations.map((conversation) => conversation.conversation_info.conversation_id);
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
