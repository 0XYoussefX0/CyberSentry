"use client";

import logout from "@/app/actions/(auth)/logout";
import { toast } from "@/hooks/use-toast";

function LogOutButton() {
  const handleLogOut = async () => {
    const response = await logout();
    if (response && response.status === "error") {
      toast({
        title: "Error logging out",
        description: response.message,
      });
    }
  };

  return (
    <button onClick={() => handleLogOut()} className="text-red-400">
      Log out
    </button>
  );
}

export default LogOutButton;
