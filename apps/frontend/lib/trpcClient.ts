import type { AppRouter } from "@pentest-app/trpc/router";
import { createTRPCReact } from "@trpc/react-query";

export const trpcClient = createTRPCReact<AppRouter>();
