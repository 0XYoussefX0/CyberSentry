import { createExpressMiddleware } from "@trpc/server/adapters/express";
import type { NextFunction, Request, Response } from "express";

import { appRouter } from "@pentest-app/trpc/router";
import type { Context } from "@pentest-app/types/server";

import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import { ENCRYPTION_KEY, env, isProduction } from "@/src/utils/env.js";

import {
  auth,
  createCookiesObj,
  db,
  minio,
  resend,
} from "@/src/utils/config.js";
import type { Handler } from "express";

import cors from "cors";

export const validateOrigin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const origin = req.get("Origin");

  if (origin === null || origin !== `https://${env.DOMAIN_NAME}`) {
    return res.status(403).json({ message: "Access forbidden" });
  }

  next();
};

// TODO: create different contexts for different routers
export const initializeTRPC: () => [string, Handler] = () => {
  return [
    "/trpc",
    createExpressMiddleware({
      middleware: cors({
        // TODO: change the domain name, add some sort of env variable for the frnt end domain name
        origin: isProduction ? "ogabonga.com" : "http://localhost:3000",
        credentials: true,
      }),
      router: appRouter,
      createContext: ({ req, res }: CreateExpressContextOptions): Context => {
        return {
          minio,
          resend,
          auth,
          cookies: createCookiesObj(req, res),
          db,
          isProduction,
          minioHost: env.MINIO_HOST_URL,
          ENCRYPTION_KEY,
        };
      },
    }),
  ];
};
