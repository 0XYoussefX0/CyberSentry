"use client";

import { sendConfirmationEmail } from "@/actions/auth/actions";
import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/use-toast";
import { useAction } from "next-safe-action/hooks";

function ResendButton() {
  const { execute, isExecuting } = useAction(sendConfirmationEmail, {
    onSuccess: () => {
      toast({
        title: "Email Has been resent",
        toastType: "successful",
      });
    },
  });

  return (
    <Button disabled={isExecuting} onClick={() => execute()}>
      Resend
    </Button>
  );
}

export default ResendButton;
