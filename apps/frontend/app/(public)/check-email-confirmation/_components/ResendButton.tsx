"use client";

import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/use-toast";
import { trpcClient } from "@/lib/trpcClient";

function ResendButton() {
  const resendConfirmationEmail =
    trpcClient.resendConfirmationEmail.useMutation();

  const { data } = resendConfirmationEmail;

  if (data?.status) {
    toast({
      title: "Email Has been resent",
      toastType: "successful",
    });
  }

  return (
    <Button onClick={() => resendConfirmationEmail.mutate()}>Resend</Button>
  );
}

export default ResendButton;
