"use client";

import phoneNumberIcon from "@/assets/phoneNumberIcon.svg";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import countriesData from "@/public/assets/countriesData/data.json";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";

import parsePhoneNumber from "libphonenumber-js";
import { generatePlaceholder } from "@/lib/utils.client";

import dropDownIcon from "@/assets/dropDownIcon.svg";

export default function PhoneNumber({ nextStep }: { nextStep: () => void }) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("MA");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const [selectIsOpen, setSelectIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch("/selectedCountry");
      if (response.ok) {
        const { country } = await response.json();
        if (country) {
          setSelectedCountry(country);
        }
      }
    })();
  }, []);

  const phoneNumberData = parsePhoneNumber(phoneNumber);

  let formattedPhoneNumber = phoneNumberData?.formatInternational();

  console.log(phoneNumberData);

  if (phoneNumberData?.country) {
    formattedPhoneNumber = phoneNumberData?.formatNational();
    if (phoneNumberData?.country !== selectedCountry) {
      setSelectedCountry(phoneNumberData.country);
    }
  }

  const submitPhoneNumber = () => {
    setLoading(true);
    const result = parsePhoneNumber(phoneNumber, selectedCountry);
    if (!result) {
      setPhoneNumberError("Invalid phone number");
      return;
    }
    if (result.isValid()) {
      localStorage.setItem("phoneNumber", result.number);
      setPhoneNumberError("");
      /* move on to the next step */
      nextStep();
    } else {
      setPhoneNumberError("Invalid phone number");
    }
    setLoading(false);
  };

  let placeholder = useMemo(
    () => generatePlaceholder(selectedCountry),
    [selectedCountry]
  );

  return (
    <>
      <div className="mask-2"></div>
      <div className="gridd-2"></div>
      <div className="flex flex-col gap-8">
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
                <Select
                  value={selectedCountry}
                  onValueChange={(value) => {
                    setPhoneNumber("");
                    setSelectedCountry(value as CountryCode);
                  }}
                  open={selectIsOpen}
                  onOpenChange={setSelectIsOpen}
                >
                  <SelectTrigger className="w-fit shrink-0 caret-transparent countryTrigger flex items-center px-3 h-[46px] gap-1 border border-solid border-gray-300 rounded-lg rounded-r-none border-r-0">
                    <SelectValue placeholder="Theme" />
                    <div
                      className={`w-5 h-5 flex items-center justify-center ${
                        selectIsOpen ? "rotate-180" : "rotate-0"
                      } transition-transform`}
                    >
                      <img src={dropDownIcon.src} alt="" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white w-[300px]">
                    {countriesData.map(({ code, country, icon, alpha2 }) => (
                      <SelectItem
                        value={alpha2}
                        key={country}
                        className="px-4 w-full hover:bg-gray-200 cursor-pointer transition-colors mt-1 rounded-md"
                      >
                        <div className="flex w-full items-center gap-3 ">
                          <img
                            src={`/assets/countriesData/countriesFlags/${icon}`}
                            alt=""
                            width={21}
                            height={15}
                          />
                          <div className="countryData flex items-center gap-1 py-1">
                            <div className="text-gray-500 text-xs leading-[18px]">
                              {code}
                            </div>
                            <div className="text-gray-700 font-medium text-sm leading-5">
                              {country}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="pl-0 border-l-0 rounded-l-none h-[46px] outline-none flex-1"
                  type="tel"
                  id="phoneNumber"
                  value={formattedPhoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  name="phoneNumber"
                  placeholder={placeholder}
                />
              </div>
              {phoneNumberError && (
                <span className="text-red-500 text-sm">{phoneNumberError}</span>
              )}
            </div>
          </div>
          <Button className="mt-1" disabled={loading}>
            Continue
          </Button>
        </form>
      </div>
    </>
  );
}
