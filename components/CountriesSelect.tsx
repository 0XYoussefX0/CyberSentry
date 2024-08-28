"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import countriesData from "@/public/assets/countriesData/data.json";
import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";

import { CountryCode } from "libphonenumber-js";

import dropDownIcon from "@/assets/dropDownIcon.svg";

import { useVirtualizer } from "@tanstack/react-virtual";
import { FixedSizeList } from "react-window";

type CoutriesSelectProps = {
  selectedCountry: CountryCode;
  setSelectedCountry: Dispatch<SetStateAction<CountryCode>>;
  setResetPhoneNumber: Dispatch<SetStateAction<boolean>>;
};

function CountriesSelect({
  selectedCountry,
  setSelectedCountry,
  setResetPhoneNumber,
}: CoutriesSelectProps) {
  const [selectIsOpen, setSelectIsOpen] = useState(false);

  const [{ icon: selectedCountryIcon, country: selectedCountryName }] =
    countriesData.filter(({ alpha2 }) => alpha2 === selectedCountry);

  return (
    <Select
      value={selectedCountry}
      onValueChange={(value) => {
        setResetPhoneNumber(true);
        setSelectedCountry(value as CountryCode);
      }}
      open={selectIsOpen}
      onOpenChange={setSelectIsOpen}
    >
      <SelectTrigger className="w-fit shrink-0 caret-transparent countryTrigger flex items-center px-3 h-[46px] gap-1 border border-solid border-gray-300 rounded-lg rounded-r-none border-r-0">
        <SelectValue aria-label={selectedCountryName} placeholder="Theme">
          <img
            src={`/assets/countriesData/countriesFlags/${selectedCountryIcon}`}
            alt=""
            width={21}
            height={15}
          />
        </SelectValue>
        <div
          className={`w-5 h-5 flex items-center justify-center ${
            selectIsOpen ? "rotate-180" : "rotate-0"
          } transition-transform`}
        >
          <img src={dropDownIcon.src} alt="" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white w-[300px]">
        <FixedSizeList
          width={"100%"}
          height={350}
          itemCount={countriesData.length}
          itemSize={44}
          overscanCount={20}
        >
          {({ index, style }) => {
            const { code, country, icon, alpha2 } = countriesData[index];
            return (
              <SelectItem
                style={{
                  ...style,
                }}
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
            );
          }}
        </FixedSizeList>
      </SelectContent>
    </Select>
  );
}

export default CountriesSelect;
