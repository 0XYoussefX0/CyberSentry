"use client";

import { forwardRef, useEffect, useState } from "react";

import { MentionInputProps } from "@/lib/types";

import { Label } from "@/components/ui/Label";

const MentionInput = forwardRef<HTMLInputElement, MentionInputProps>(
  (
    {
      setClearInput,
      clearInput,
      selectedUsers,
      showSuggestions,
      setShowSuggestions,
      debounceFetchUsers,
      deletePreviousSelectedUser,
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
      if (clearInput) {
        setInputValue("");
        setClearInput(false);
      }
    }, [clearInput]);

    return (
      <input
        onKeyDown={deletePreviousSelectedUser}
        ref={ref}
        className="flex-1 w-[120px] focus:outline-none leading-6 font-normal placeholder:text-gray-500"
        value={inputValue}
        placeholder={!selectedUsers ? "Mention people using '@'" : ""}
        onChange={(e) => {
          const inputValue = e.target.value;
          setInputValue(inputValue);

          if (inputValue.includes("@")) {
            if (!showSuggestions) {
              setShowSuggestions(true);
            }
            const query = inputValue.split("@")[1];
            debounceFetchUsers(query);
          } else {
            setShowSuggestions(false);
          }
        }}
      />
    );
  },
);

MentionInput.displayName = "MentionInput";

export default MentionInput;
