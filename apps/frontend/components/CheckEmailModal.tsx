import type { CheckEmailModalProps } from "@/lib/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import emailIcon from "@/assets/emailIcon.svg";

function CheckEmailModal({
  open,
  setOpen,
  email,
  message,
}: CheckEmailModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => setOpen((prev) => ({ ...prev, open: v }))}
    >
      <DialogContent className="rounded-xl bg-white pt-0 pb-0">
        <div className="relative flex flex-col items-center gap-6 pt-12 pb-6">
          <div className="gridd"></div>
          <div className="mask"></div>
          <div className="shadows flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 border-solid bg-white">
            <img src={emailIcon.src} alt="" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center font-semibold text-2xl text-gray-900 leading-8">
              Check your email
            </DialogTitle>
            <DialogDescription className="text-center font-normal text-base text-gray-600 leading-6">
              {message}
              <br /> <span className="font-medium">{email}</span>
            </DialogDescription>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CheckEmailModal;
