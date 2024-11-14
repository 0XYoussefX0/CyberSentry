import type { AppRouter } from "@pentest-app/trpc/router";

import { formatCookies } from "@/lib/utils";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { cookies } from "next/headers";

export const trpcServerClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
      headers() {
        const cookieStore = cookies();

        const allCookies = cookieStore.getAll();

        const formattedCookies = formatCookies(allCookies);

        return {
          Cookie: formattedCookies,
        };
      },
    }),
  ],
});
