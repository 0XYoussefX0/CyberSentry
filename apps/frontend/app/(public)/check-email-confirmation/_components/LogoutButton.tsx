"use client";

import { Button } from "@/components/ui/Button";
import { trpcClient } from "@/lib/trpcClient";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const router = useRouter();

  const logout = trpcClient.logout.useMutation();
  const { data, isPending: LogOutIsPending } = logout;

  if (data?.status) {
    router.push("/login");
  }

  return (
    <Button
      disabled={LogOutIsPending}
      variant={"secondary"}
      onClick={async () => await logout.mutate()}
    >
      Log Out
    </Button>
  );
}

export default LogoutButton;
