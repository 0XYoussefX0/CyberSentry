import { CheckEmailModalProps } from "@/lib/types";

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
      <DialogContent className="bg-white rounded-xl pt-0 pb-0">
        <div className="relative flex flex-col items-center pb-6 pt-12 gap-6">
          <div className="gridd"></div>
          <div className="mask"></div>
          <div className="bg-white border border-solid border-gray-200 w-14 h-14 flex items-center justify-center rounded-xl shadows">
            <img src={emailIcon.src} alt="" />
          </div>
          <DialogHeader>
            <DialogTitle className="font-semibold text-2xl text-center leading-8 text-gray-900">
              Check your email
            </DialogTitle>
            <DialogDescription className="font-normal text-center text-base leading-6 text-gray-600">
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
