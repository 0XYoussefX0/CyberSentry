import type { Metadata } from "next";
// import { redirect } from "next/navigation";

import { auth } from "@/actions/config";
import AppContent from "@/app/(app)/_components/AppContent";
// import ConnectToSocket from "@/components/ConnectToSocket";
import SideBar from "@/app/(app)/_components/SideBar";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = cookies();
  const { user } = await auth.getUser(cookiesStore);

  if (!user) return "User Not Found";

  return (
    <div className="flex">
      {/* <ConnectToSocket /> */}
      <SideBar
        userImage={user.user_image}
        userName={user.username}
        userEmail={user.email}
      />
      <AppContent>{children}</AppContent>
    </div>
  );
}
