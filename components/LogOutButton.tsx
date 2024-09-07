"use client";

import logout from "@/app/actions/(auth)/logout";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "./ui/toaster";

function LogOutButton() {
  const handleLogOut = async () => {
    const response = await logout();
    if (response && response.status === "error") {
      toast({
        title: "Error logging out",
        description: response.error,
      });
    }
  };

  return (
    <>
      <Toaster />
      <button onClick={() => handleLogOut()} className="text-red-400">
        Log out
      </button>
    </>
  );
}

export default LogOutButton;
