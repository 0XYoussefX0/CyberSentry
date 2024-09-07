"use client";

import { useState, useEffect } from "react";
import auth from "@/lib/auth";

export default function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<undefined | boolean>(undefined);
  useEffect(() => {
    (async () => {
      const user = false;
      // use a library that allows you to read cookies in the client
      // const user = await auth.getUser();

      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    })();
  }, []);
  return {
    isLoggedIn,
  };
}
