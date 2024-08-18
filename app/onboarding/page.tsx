"use client";

import profileEditIcon from "@/assets/profileEditIcon.svg";
import addAvatarIcon from "@/assets/addAvatarIcon.svg";
import accountIcon from "@/assets/accountIcon.svg";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

import * as v from "valibot";

import {
  fullNameSchema,
  avatarImageSchemaClient,
  onCropCompleteType,
  croppedArea,
} from "@/lib/types";

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
import completeProfile from "../actions/(auth)/completeProfile";

export default function Onboarding() {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<croppedArea | null>(null);
  const [zoom, setZoom] = useState(2);

  const [openCropModal, setOpenCropModal] = useState(false);

  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  const [avatarImage, setAvatarImage] = useState<string | undefined>();

  const [formErrors, setFormErrors] = useState<{
    avatarImage: string[];
    fullname: string[];
  }>({
    avatarImage: [],
    fullname: [],
  });

  const submitProfileData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    const fullname = formData.get("fullname");

    // const result = v.safeParse(fullNameSchema, { fullname });
    // if (result.success) {
    //   return result.output.fullname;
    // } else {
    //   console.log(result.issues);
    //   // setFormErrors((prev) => ({
    //   //   ...prev,
    //   //   fullname: result.issues,
    //   // }));
    // }

    if (fullname && croppedImage) {
      // const file = new File([croppedImage], "avatar.jpeg", {
      //   type: croppedImage.type,
      // });
      formData.set("avatarImage", croppedImage);

      const response = await completeProfile(formData);
      console.log(response);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await v.safeParseAsync(avatarImageSchemaClient, {
        avatarImage: file,
      });
      if (result.success) {
        const dataUrl = URL.createObjectURL(file);
        setAvatarImage(dataUrl);
        setOpenCropModal(true);
      } else {
        console.log(result.issues);
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
    <main className="px-4 pt-12 pb-6 flex flex-col gap-[132px] relative">
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

      <div className="mask-2"></div>
      <div className="gridd-2"></div>
      <div className="flex flex-col gap-8">
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
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Enter your name"
            />
          </div>
          <Button className="mt-1">Continue</Button>
        </form>
      </div>
      <div>
        <div className="pb-1 flex gap-3 opacity-60">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-white border border-solid border-gray-200 w-12 h-12 flex items-center justify-center rounded-xl shadows">
              <img src={accountIcon.src} alt="" />
            </div>
            <div className="w-0.5 h-3 bg-gray-200 rounded-sm"></div>
          </div>
          <div className="pt-1">
            <h2 className="font-semibold text-sm leading-5 text-gray-700">
              Your details
            </h2>
            <p className="font-normal text-sm leading-5 text-gray-600">
              Please provide your name and email
            </p>
          </div>
        </div>
        <div className="pb-1 flex gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-white border border-solid border-gray-200 w-12 h-12 flex items-center justify-center rounded-xl shadows">
              <img src={accountIcon.src} alt="" />
            </div>
            <div className="w-0.5 h-3 bg-gray-200 rounded-sm"></div>
          </div>
          <div className="pt-1">
            <h2 className="font-semibold text-sm leading-5 text-gray-700">
              Your details
            </h2>
            <p className="font-normal text-sm leading-5 text-gray-600">
              Please provide your name and email
            </p>
          </div>
        </div>
        <div className="pb-1 flex gap-3 opacity-60">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-white border border-solid border-gray-200 w-12 h-12 flex items-center justify-center rounded-xl shadows">
              <img src={accountIcon.src} alt="" />
            </div>
            <div className="w-0.5 h-3 bg-gray-200 rounded-sm"></div>
          </div>
          <div className="pt-1">
            <h2 className="font-semibold text-sm leading-5 text-gray-700">
              Your details
            </h2>
            <p className="font-normal text-sm leading-5 text-gray-600">
              Please provide your name and email
            </p>
          </div>
        </div>
        <div className="pb-1 flex gap-3 opacity-60">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-white border border-solid border-gray-200 w-12 h-12 flex items-center justify-center rounded-xl shadows">
              <img src={accountIcon.src} alt="" />
            </div>
            <div className="w-0.5 h-3 bg-transparent rounded-sm"></div>
          </div>
          <div className="pt-1">
            <h2 className="font-semibold text-sm leading-5 text-gray-700">
              Your details
            </h2>
            <p className="font-normal text-sm leading-5 text-gray-600">
              Please provide your name and email
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
