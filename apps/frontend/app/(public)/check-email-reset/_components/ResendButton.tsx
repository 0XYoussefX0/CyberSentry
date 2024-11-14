"use client";

import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/use-toast";
import { trpcClient } from "@/lib/trpcClient";

function ResendButton({ email }: { email: string }) {
  const resendResetEmail = trpcClient.resendResetEmail.useMutation();

  const { data } = resendResetEmail;

  if (data?.status === "success") {
    toast({
      title: "Email has been resent",
      toastType: "successful",
    });
  }

  return (
    <Button onClick={() => resendResetEmail.mutate({ email })}>Resend</Button>
  );
}

export default ResendButton;
