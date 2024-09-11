import LogOutButton from "@/components/LogOutButton";
import Logo from "@/components/Logo";
import messagesIcon from "@/assets/messagesIcon.svg";
import homeIcon from "@/assets/homeIcon.svg";
import dashboardIcon from "@/assets/dashboardIcon.svg";
import projectsIcon from "@/assets/projectsIcon.svg";
import tasksIcon from "@/assets/tasksIcon.svg";
import piechartIcon from "@/assets/piechartIcon.svg";
import supportIcon from "@/assets/supportIcon.svg";
import settingsIcon from "@/assets/settingsIcon.svg";

import Link from "next/link";
import { getImageMimeType } from "@/lib/utils";

import { createSessionClient } from "@/lib/appwrite/server";
import { getUser } from "@/lib/appwrite/utils";
import { redirect } from "next/navigation";
import { DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/env";
import { AppwriteException } from "node-appwrite";

const NavigationLink = ({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: any;
}) => {
  return (
    <Link
      className="flex hover:bg-gray-100 rounded-md py-2.5 px-3 gap-3 items-center"
      key={label}
      href={href}
    >
      <img src={icon.src} alt="" />
      <div className="text-gray-700 font-semibold leading-6">{label}</div>
    </Link>
  );
};

const toplinks = [
  {
    icon: homeIcon,
    label: "Home",
    href: "/",
  },
  {
    icon: dashboardIcon,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: projectsIcon,
    label: "Projects",
    href: "/projects",
  },
  {
    icon: tasksIcon,
    label: "Tasks",
    href: "/tasks",
  },
  {
    icon: piechartIcon,
    label: "Reporting",
    href: "/reporting",
  },
  {
    icon: messagesIcon,
    label: "Messages",
    href: "/messages",
  },
];

const bottomLinks = [
  {
    icon: supportIcon,
    label: "Support",
    href: "/support",
  },
  {
    icon: settingsIcon,
    label: "Settings",
    href: "/settings",
  },
];

export default async function SideBar() {
  const { account, databases } = await createSessionClient();
  const user = await getUser(account);

  if (!user) redirect("/login");

  let err: AppwriteException;

  try {
    const { avatar_image } = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      user.$id
    );

    return (
      <div className="sticky h-screen border-r-gray-200 border-r border-solid max-w-[312px] w-full top-0 left-0 flex flex-col justify-between px-4 py-8">
        <div className="flex gap-6 flex-col">
          {/* change the logo to use the font instead of the way you are currently using it and expirement with diffferent font sizes and font weights */}
          {/* <Logo /> */}
          <div className="flex flex-col gap-0.5">
            {toplinks.map((link) => (
              <NavigationLink {...link} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-0.5">
            {bottomLinks.map((link) => (
              <NavigationLink {...link} />
            ))}
          </div>
          <div className="border-t-gray-200 border-t flex gap-10 pt-6 border-solid">
            <div className="flex gap-3 items-center flex-1">
              <img
                src={avatar_image}
                alt="Your Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex flex-col overflow-hidden">
                <div className="text-gray-900 text-sm leading-5 font-semibold">
                  {user.name}
                </div>
                <div className="text-sm leading-5 font-normal text-gray-600 truncate">
                  {user.email}
                </div>
              </div>
            </div>
            <LogOutButton />
          </div>
        </div>
      </div>
    );
  } catch (e) {
    // handle the error later
    err = e as AppwriteException;
  }

  if (err) {
    redirect(`/error?errorMessage=${err.message}`);
  }
}
