import type { NextFunction, Request, Response } from "express";

import { env } from "@/src/utils/env.js";

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
