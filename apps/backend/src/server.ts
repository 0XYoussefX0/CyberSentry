import { createServer } from "node:http";
import cookieParser from "cookie-parser";
import express from "express";

import cors from "cors";

import { adminCredentials, env, isProduction } from "@/src/utils/env.js";

import { validateOrigin } from "./middlewares.js";
import { signTheAdminUp } from "./utils/config.js";

import { runMigrations } from "@pentest-app/db/migrate";

const app = express();

app.use(
  cors({
    // TODO: change the domain name, add some sort of env variable for the frnt end domain name
    origin: isProduction ? "ogabonga.com" : "http://localhost:3000",
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

if (isProduction) {
  app.use(validateOrigin);
}

await signTheAdminUp(adminCredentials);

await runMigrations(env.DATABASE_URL);

const server = createServer(app);

server.listen(4000, () => {
  console.log("listening on *:4000");
});
