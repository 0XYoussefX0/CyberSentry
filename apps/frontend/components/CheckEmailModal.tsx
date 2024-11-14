import type { CheckEmailModalProps } from "@pentest-app/types/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import emailIcon from "@/assets/emailIcon.svg";
import { trpcClient } from "@/lib/trpcClient";
import { Button } from "./ui/Button";

function CheckEmailModal({
  open,
  setOpen,
  message,
  email,
}: CheckEmailModalProps) {
  const resend = trpcClient.resendEmail.useMutation();

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => setOpen((prev) => ({ ...prev, open: v }))}
    >
      <DialogContent className="rounded-xl bg-white pt-0 pb-0">
        <div className="relative flex flex-col items-center gap-6 pt-12 pb-6">
          <div className="gridd" />
          <div className="mask" />
          <div className="shadows flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 border-solid bg-white">
            <img src={emailIcon.src} alt="" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center font-semibold text-2xl text-gray-900 leading-8">
              Check your email
            </DialogTitle>
            <DialogDescription className="text-center font-normal text-base text-gray-600 leading-6">
              {message}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => resend.mutate({ email })}>Resend</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CheckEmailModal;
