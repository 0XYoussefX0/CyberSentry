"use client";

import phoneNumberIcon from "@/assets/phoneNumberIcon.svg";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

import { useEffect, useState, MutableRefObject, FormEvent } from "react";

import { CountryCode } from "libphonenumber-js";

import PhoneNumberInput from "../PhoneNumberInput";

import parsePhoneNumber from "libphonenumber-js";

import CountriesSelect from "@/components/CountriesSelect";
import { motion } from "framer-motion";

export default function PhoneNumber({
  nextStep,
  phoneNumberRef,
}: {
  nextStep: () => void;
  phoneNumberRef: MutableRefObject<string>;
}) {
  const [exit, setExit] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("MA");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const [loading, setLoading] = useState(false);

  const [resetPhoneNumber, setResetPhoneNumber] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch("/userCountry");
      if (response.ok) {
        const { country } = await response.json();
        if (country) {
          setSelectedCountry(country);
        }
      }
    })();
  }, []);

  const submitPhoneNumber = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const phoneNumber = phoneNumberRef.current;
    const result = parsePhoneNumber(phoneNumber, selectedCountry);
    if (result && result.isValid()) {
      phoneNumberRef.current = result.number;
      setPhoneNumberError("");
      setLoading(false);
      setExit(true);
      return;
    }
    setPhoneNumberError("Invalid phone number");
    setLoading(false);
  };

  return (
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
            <img src={phoneNumberIcon.src} alt="" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-center leading-8 text-2xl text-gray-900">
              Add Your Phone Number
            </h1>
            <p className="text-center font-normal leading-6 text-base text-gray-600">
              Provide your phone number to help secure your account and recover
              it if needed.
            </p>
          </div>
        </div>
        <form className="flex flex-col gap-5" onSubmit={submitPhoneNumber}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="flex flex-col gap-1">
              <div className="flex">
                <CountriesSelect
                  selectedCountry={selectedCountry}
                  setResetPhoneNumber={setResetPhoneNumber}
                  setSelectedCountry={setSelectedCountry}
                />
                <PhoneNumberInput
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  phoneNumberRef={phoneNumberRef}
                  resetPhoneNumber={resetPhoneNumber}
                  setResetPhoneNumber={setResetPhoneNumber}
                />
              </div>
              {phoneNumberError && (
                <span className="text-red-500 text-sm">{phoneNumberError}</span>
              )}
            </div>
          </div>
          <Button className="mt-1" disabled={loading}>
            {loading ? "Verifying..." : "Continue"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
