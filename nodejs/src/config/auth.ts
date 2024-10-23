import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { sessionTable, userTable } from "@/models/user.js";
import { db } from "@/config/drizzle.js";
import { Lucia } from "lucia";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
    };
  },
});
