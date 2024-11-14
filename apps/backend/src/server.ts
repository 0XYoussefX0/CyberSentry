import { createServer } from "node:http";
import cookieParser from "cookie-parser";
import express from "express";

import cors from "cors";

import { isProduction } from "@/src/utils/env.js";

import { initializeTRPC, validateOrigin } from "./middlewares.js";

import { auth, createCookiesObj } from "@/src/utils/config.js";
import { TokenSchema } from "@pentest-app/schemas/server";
import * as v from "valibot";

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
  res.cookie("session", "jsjjsjs");
  res.status(200).json({ status: "UP" });
});

if (isProduction) {
  app.use(validateOrigin);
}

app.post("/verifyAuth", async (req, res) => {
  const body = req.body;

  const validationResult = v.safeParse(TokenSchema, body);

  if (validationResult.issues) return res.status(400).send("Token is invalid");

  const { token } = validationResult.output;

  req.cookies.session = token;

  const cookies = createCookiesObj(req, res);

  const result = await auth.validateSessionToken(cookies);

  return res.status(200).json(result);
});

app.use(...initializeTRPC());

const server = createServer(app);

server.listen(4000, () => {
  console.log("listening on *:4000");
});
