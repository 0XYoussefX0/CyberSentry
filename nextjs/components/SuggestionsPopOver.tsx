"use client";

import { forwardRef } from "react";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { ListBox, ListBoxItem } from "react-aria-components";

import { SuggestionsPopOverProps } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";

import { Popover, PopoverContent } from "@/components/ui/popover";

const SuggestionsPopOver = ({
  showSuggestions,
  setShowSuggestions,
  suggestions,
  addSelectedUser,
  suggestionsRef,
}: SuggestionsPopOverProps) => {
  const { suggestionsContainer, suggestionsFirstItem } = suggestionsRef;

  return (
    <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
      <PopoverAnchor className="w-full absolute top-full mt-1 left-0" />
      <PopoverContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        style={{
          width: "var(--radix-popover-trigger-width)",
          maxHeight: "var(--radix-popover-content-available-height)",
        }}
        className=" bg-white px-2 py-2"
      >
        <ListBox
          ref={suggestionsContainer}
          shouldFocusWrap={true}
          aria-label="Favorite animal"
          selectionMode="single"
          className="flex flex-col gap-1"
        >
          {suggestions &&
            suggestions.map(({ avatar_image, name }, index) => (
              <ListBoxItem
                key={index}
                {...(index === 0 ? { ref: suggestionsFirstItem } : {})}
                onAction={() => addSelectedUser(index)}
                className="py-2.5 hover:bg-gray-200 bg-transparent transition-colors rounded-md cursor-pointer px-2 flex items-center gap-2"
              >
                <img
                  src={avatar_image}
                  className="w-6 h-6 rounded-full"
                  alt=""
                />
                <div className="text-gray-900 font-medium text-base">
                  {capitalizeFirstLetter(name)}
                </div>
                <div className="text-gray-600 ">
                  {"@" + name.split(" ")[0].toLowerCase()}
                </div>
              </ListBoxItem>
            ))}
        </ListBox>
      </PopoverContent>
    </Popover>
  );
};

const ForwadedSuggestionsPopOver = forwardRef(SuggestionsPopOver);
export default ForwadedSuggestionsPopOver;
