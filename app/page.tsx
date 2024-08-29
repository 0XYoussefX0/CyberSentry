"use client";

import logout from "@/app/actions/(auth)/logout";
import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function Home() {
  const handleLogOut = async () => {
    const response = await logout();
    if (response && response.status === "error") {
      toast({
        title: "Error logging out",
        description: response.message,
      });
    }
  };

  const [disable, setDisable] = useState(false);
  return (
    <>
      <div>Dashboard</div>
      <button onClick={() => handleLogOut()} className="text-red-400">
        Log out
      </button>
      <Button
        disabled={disable}
        className="ml-10 p-4"
        onClick={() => setDisable(!disable)}
      >
        Logging in...
      </Button>
    </>
  );
}
