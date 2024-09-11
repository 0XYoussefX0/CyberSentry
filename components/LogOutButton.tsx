"use client";

import logout from "@/app/actions/(auth)/logout";
import { toast } from "@/hooks/use-toast";
import logoutIcon from "@/assets/logoutIcon.svg";

function LogOutButton() {
  const handleLogOut = async () => {
    const response = await logout();
    if (response && response.status === "error") {
      toast({
        title: "Error logging out",
        description: response.error,
        toastType: "destructive",
      });
    }
  };

  return (
    <>
      <button aria-label="Log out" onClick={() => handleLogOut()}>
        <img src={logoutIcon.src} alt="" />
      </button>
    </>
  );
}

export default LogOutButton;
