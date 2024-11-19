"use client";

import { sendResetEmail } from "@/actions/auth/actions";
import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/use-toast";
import { useAction } from "next-safe-action/hooks";

function ResendButton({ email }: { email: string }) {
  const { execute, isExecuting } = useAction(sendResetEmail, {
    onSuccess: () => {
      toast({
        title: "Email has been resent",
        toastType: "successful",
      });
    },
  });

  return (
    <Button disabled={isExecuting} onClick={() => execute({ email })}>
      Resend
    </Button>
  );
}

export default ResendButton;
