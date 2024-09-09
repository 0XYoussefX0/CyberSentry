"use client";

import profileEditIcon from "@/assets/profileEditIcon.svg";
import addAvatarIcon from "@/assets/addAvatarIcon.svg";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

import * as v from "valibot";

import {
  onCropCompleteType,
  croppedArea,
  CompleteProfileResponse,
} from "@/lib/types";

import { fullNameSchema, avatarImageSchema } from "@/lib/validationSchemas";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import { useState, ChangeEvent, FormEvent } from "react";
import { getCroppedImg } from "@/lib/utils";

import Cropper from "react-easy-crop";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/ToolTip";

import questionIcon from "@/assets/questionIcon.svg";
import completeProfile from "@/app/actions/completeProfile";

import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";

type FormErrors = {
  avatarImage: string[];
  fullname: string[];
};

export default function ProfileDetails({ nextStep }: { nextStep: () => void }) {
  const [exit, setExit] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<croppedArea | null>(null);
  const [zoom, setZoom] = useState(2);

  const [openCropModal, setOpenCropModal] = useState(false);

  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  const [avatarImage, setAvatarImage] = useState<string | undefined>();

  const [formErrors, setFormErrors] = useState<FormErrors>({
    avatarImage: [],
    fullname: [],
  });

  const [loading, setLoading] = useState(false);

  const submitProfileData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    const fullname = formData.get("fullname");

    const result = v.safeParse(fullNameSchema, { fullname });

    if (!result.success) {
      const errorMessages: string[] = [];

      result.issues.forEach((issue) => {
        errorMessages.push(issue.message);
      });

      setFormErrors((prev) => ({
        ...prev,
        fullname: errorMessages,
      }));

      setLoading(false);
      return;
    }

    if (!croppedImage) {
      setFormErrors((prev) => ({
        ...prev,
        avatarImage: [...prev.avatarImage, "Please crop the image"],
      }));
      setLoading(false);
      return;
    }

    const file = new File([croppedImage], "avatar.jpeg", {
      type: croppedImage.type,
    });

    formData.set("avatarImage", file);

    const res = await fetch("/completeProfile", {
      method: "POST",
      body: formData,
    });

    const response: CompleteProfileResponse = await res.json();

    if (!response) return;

    switch (response.status) {
      case "success":
        setExit(true);
        break;
      case "server_error":
        toast({
          title: "Server Error",
          description: response.error,
          toastType: "destructive",
        });
        break;
      case "validation_error":
        const errorMessages: FormErrors = {
          fullname: [],
          avatarImage: [],
        };

        response.errors.forEach((error) => {
          if (error.path && error.path[0].key === "fullname") {
            errorMessages.fullname.push(error.message);
          } else {
            errorMessages.avatarImage.push(error.message);
          }
        });

        setFormErrors(errorMessages);
        break;
    }

    setLoading(false);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await v.safeParseAsync(avatarImageSchema, {
        avatarImage: file,
      });
      if (result.success) {
        const dataUrl = URL.createObjectURL(file);
        setAvatarImage(dataUrl);
        setOpenCropModal(true);
      } else {
        const errorMessages: string[] = [];

        result.issues.forEach((issue) => {
          errorMessages.push(issue.message);
        });

        setFormErrors((prev) => ({
          ...prev,
          avatarImage: errorMessages,
        }));
      }
    }
  };

  const onCropComplete: onCropCompleteType = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    if (!avatarImage || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(
        avatarImage,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
      setOpenCropModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  let croppedImageUrl;
  if (croppedImage) {
    croppedImageUrl = URL.createObjectURL(croppedImage);
  }
  return (
    <>
      <Dialog open={openCropModal} onOpenChange={setOpenCropModal}>
        <DialogContent
          noAnimation
          className="bg-white w-[95%] rounded-xl py-4 px-2 sm:px-4 max-h-[90vh]"
        >
          <DialogTitle className="flex items-center gap-2">
            Crop the image{" "}
            <TooltipProvider>
              <Tooltip defaultOpen={false}>
                <TooltipTrigger aria-label="Instructions for cropping the image">
                  <img src={questionIcon.src} alt="" />
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-black">
                  <p>
                    To zoom, use pinch gestures on mobile devices or the scroll
                    wheel on desktop devices.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
          <div className="relative h-[500px]">
            {openCropModal && (
              <Cropper
                image={avatarImage}
                crop={crop}
                zoom={zoom}
                showGrid={false}
                aspect={1}
                cropShape="round"
                rotation={rotation}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                minZoom={1}
                maxZoom={10}
                onRotationChange={setRotation}
                objectFit="horizontal-cover"
              />
            )}
          </div>
          <Button variant={"secondary"} onClick={showCroppedImage}>
            Crop it
          </Button>
        </DialogContent>
      </Dialog>
      <motion.div
        initial={{ y: 50, scale: 0.8, opacity: 0 }}
        animate={
          exit
            ? { y: -50, scale: 0.8, opacity: 0 }
            : { y: 0, scale: 1, opacity: 1 }
        }
        onAnimationComplete={() => {
          if (exit) {
            nextStep();
          }
        }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative lp:max-w-[420px] lp:w-full"
      >
        <div className="mask-2"></div>
        <div className="gridd-2"></div>
        <div className="flex flex-col gap-8 h-[484px]">
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white border border-solid border-gray-200 w-14 h-14 flex items-center justify-center rounded-xl shadows">
              <img src={profileEditIcon.src} alt="" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold text-center leading-8 text-2xl text-gray-900">
                Complete Your Profile
              </h1>
              <p className="text-center font-normal leading-6 text-base text-gray-600">
                Upload a profile picture and enter your full name. This helps us
                personalize your experience.
              </p>
            </div>
          </div>
          <form className="flex flex-col gap-5" onSubmit={submitProfileData}>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center pt-[3px] gap-4">
                <label htmlFor="avatarImage" className="cursor-pointer">
                  <img
                    src={croppedImageUrl ?? addAvatarIcon.src}
                    alt=""
                    className="object-cover w-20 h-20 rounded-full"
                  />
                  <span className="sr-only">Select an avatar image</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  aria-describedby="avatar-description"
                  id="avatarImage"
                  name="avatarImage"
                  multiple={false}
                  accept=".jpg, .jpeg, .png"
                  className="sr-only"
                />
                <div className="flex-1">
                  <span>Avatar Image</span>
                  <p
                    id="avatar-description"
                    className="text-sm font-medium leading-5 text-gray-400"
                  >
                    JPG or PNG, max 2MB and 5000x5000px
                  </p>
                </div>
              </div>
              {formErrors.avatarImage.map((error) => (
                <p className="text-red-500 text-sm font-normal">{error}</p>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="Enter your name"
              />
              {formErrors.fullname.map((error) => (
                <p className="text-red-500 text-sm font-normal">{error}</p>
              ))}
            </div>
            <Button className="mt-1" disabled={loading}>
              {loading ? "Submitting..." : "Continue"}
            </Button>
          </form>
        </div>
      </motion.div>
      <Toaster />
    </>
  );
}
