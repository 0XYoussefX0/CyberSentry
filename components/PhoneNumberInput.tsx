"use client";

import { Input } from "@/components/ui/Input";

import {
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  MutableRefObject,
} from "react";

import { CountryCode } from "libphonenumber-js";
import parsePhoneNumber from "libphonenumber-js";

import { generatePlaceholder } from "@/lib/utils.client";

type PhoneNumberProps = {
  selectedCountry: CountryCode;
  setSelectedCountry: Dispatch<SetStateAction<CountryCode>>;
  phoneNumberRef: MutableRefObject<string>;
  resetPhoneNumber: boolean;
  setResetPhoneNumber: Dispatch<SetStateAction<boolean>>;
};
function PhoneNumberInput({
  selectedCountry,
  setSelectedCountry,
  phoneNumberRef,
  resetPhoneNumber,
  setResetPhoneNumber,
}: PhoneNumberProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    phoneNumberRef.current = phoneNumber;
  }, [phoneNumber]);

  useEffect(() => {
    if (resetPhoneNumber) {
      setPhoneNumber("");
    }
  }, [resetPhoneNumber]);

  useEffect(() => {
    if (phoneNumber.length > 0 && resetPhoneNumber) {
      setResetPhoneNumber(false);
    }
  }, [phoneNumber]);

  const phoneNumberData = parsePhoneNumber(phoneNumber);

  let formattedPhoneNumber = phoneNumberData?.formatInternational();

  if (phoneNumberData?.country && formattedPhoneNumber?.startsWith("+")) {
    formattedPhoneNumber = phoneNumberData?.formatNational();
    if (phoneNumberData?.country !== selectedCountry) {
      setSelectedCountry(phoneNumberData.country);
    }
  }
  let placeholder = useMemo(
    () => generatePlaceholder(selectedCountry),
    [selectedCountry]
  );
  return (
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
  );
}

export default PhoneNumberInput;
