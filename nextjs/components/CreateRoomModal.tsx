"use client";

import React, {
  FormEvent,
  FormEventHandler,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { UserInfo } from "@/lib/types";
import { debounce } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import createRoom from "@/app/actions/createRoom";
import getUsers from "@/app/actions/getUsers";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import MentionInput from "@/components/MentionInput";
import SuggestionsPopOver from "@/components/SuggestionsPopOver";
import UserTag from "@/components/UserTag";

import editIcon from "@/assets/editIcon.svg";

function CreateRoomModal() {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<UserInfo[]>([]);

  const [selectedUsers, setSelectedUsers] = useState<UserInfo[]>([]);
  const [clearInput, setClearInput] = useState(false);

  const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const suggestionsRef = {
    suggestionsContainer: useRef<HTMLDivElement | null>(null),
    suggestionsFirstItem: useRef<HTMLDivElement | null>(null),
  };

  const fetchUsers = async (query: string) => {
    const selectedUsersIds = selectedUsers.map((user) => user.user_id);
    const response = await getUsers(query, selectedUsersIds);

    if (Array.isArray(response)) {
      setSuggestions(response);
      return;
    }
    if (response && response.status == "server_error") {
      toast({
        title: "Server Error",
        description: response.error,
        toastType: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers("");
  }, []);

  const debounceFetchUsers = debounce(fetchUsers, 150);

  const addSelectedUser = (index: number) => {
    if (!suggestions) return;
    const user = suggestions[index];

    setSelectedUsers((prev) => [...prev, user]);
    setSuggestions((prev) => prev.filter((_, i) => i !== index));
    setShowSuggestions(false);
    setClearInput(true);
  };

  const deselectUser = (index: number) => {
    setSelectedUsers((prev) => prev.filter((_, i) => i !== index));
  };

  const focusInput = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (inputRef.current && e.target === e.currentTarget) {
      inputRef.current.focus();
    }
  };

  const deletePreviousSelectedUser = (e: KeyboardEvent<HTMLInputElement>) => {
    if (inputRef.current && inputRef.current.value !== "") return;
    if (e.key === "Backspace" || e.key === "Delete") {
      setSelectedUsers((prev) => prev.slice(0, -1));
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const { suggestionsContainer, suggestionsFirstItem } = suggestionsRef;
    if (
      suggestionsContainer.current &&
      suggestionsFirstItem.current &&
      showSuggestions &&
      suggestions.length > 0 &&
      e.key === "ArrowDown" &&
      !suggestionsContainer.current.contains(document.activeElement)
    ) {
      suggestionsFirstItem.current.focus();
    }
  };

  const router = useRouter();

  const handleCreateRoom = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedUsersIds = selectedUsers.map((user) => user.user_id);

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    const roomName = formData.get("roomName");

    if (
      (roomName !== null && typeof roomName !== "string") ||
      (roomName !== null && roomName.length === 0)
    ) {
      toast({
        title: "Validation Error",
        description: "Invalid room name value",
        toastType: "destructive",
      });
      return;
    }

    const response = await createRoom(selectedUsersIds, roomName);

    if (response && response.status === "server_error") {
      toast({
        title: "Server Error",
        description: response.error,
        toastType: "destructive",
      });
    } else {
      const { roomID } = response;
      setOpenCreateRoomModal(false);
      setSelectedUsers([]);
      router.push(`/messages?roomID=${roomID}`);
    }
  };

  // make this component accessible

  return (
    <Dialog
      open={openCreateRoomModal}
      onOpenChange={(v) => {
        if (!v) {
          setSelectedUsers([]);
        }
        setOpenCreateRoomModal(v);
      }}
    >
      <DialogTrigger
        aria-label="Create a Room"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-solid border-gray-300 bg-white shadow-xs"
      >
        <img src={editIcon.src} alt="" />
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create a Room</DialogTitle>
          <DialogDescription>
            Add one or many people to the room.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateRoom} className="flex flex-col gap-4">
          {selectedUsers.length > 1 && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                type="text"
                id="roomName"
                name="roomName"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div
            onClick={focusInput}
            onKeyDown={onKeyDown}
            className="relative focus-within:outline-brand-500 outline-2 transition-all outline-transparent outline flex-wrap cursor-text flex gap-2 bg-white border border-solid border-gray-300 rounded-lg py-2.5 px-3.5 leading-6 font-normal placeholder:text-gray-500"
          >
            {selectedUsers &&
              selectedUsers.map(({ name, avatar_image }, index) => (
                <UserTag
                  name={name}
                  avatar_image={avatar_image}
                  index={index}
                  deselectUser={deselectUser}
                />
              ))}
            <MentionInput
              ref={inputRef}
              clearInput={clearInput}
              selectedUsers={selectedUsers}
              showSuggestions={showSuggestions}
              setClearInput={setClearInput}
              setShowSuggestions={setShowSuggestions}
              debounceFetchUsers={debounceFetchUsers}
              deletePreviousSelectedUser={deletePreviousSelectedUser}
            />

            {showSuggestions && (
              <SuggestionsPopOver
                suggestionsRef={suggestionsRef}
                setShowSuggestions={setShowSuggestions}
                suggestions={suggestions}
                addSelectedUser={addSelectedUser}
                showSuggestions={showSuggestions}
              />
            )}
          </div>
          <Button>Create Room</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateRoomModal;
