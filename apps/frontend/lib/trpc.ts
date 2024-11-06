import type { AppRouter } from "@pentest-app/trpc/router";
import { createTRPCReact } from "@trpc/react-query";

import { createTRPCClient, httpBatchLink } from "@trpc/client";

export const trpcClient = createTRPCReact<AppRouter>();

export const trpcServerClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
    }),
  ],
});
