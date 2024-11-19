"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

import { logout } from "@/actions/auth/actions";
import { useAction } from "next-safe-action/hooks";

function LogoutButton() {
  const router = useRouter();

  const { execute, isExecuting } = useAction(logout, {
    onSuccess: () => {
      router.push("/login");
    },
  });

  return (
    <Button
      disabled={isExecuting}
      variant={"secondary"}
      onClick={() => execute()}
    >
      Log Out
    </Button>
  );
}

export default LogoutButton;
