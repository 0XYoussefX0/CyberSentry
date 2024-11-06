import Link from "next/link";

import LoginForm from "@/components/auth/LoginForm";
import Logo from "@/components/icons/Logo";

import emailIcon from "@/assets/emailIcon.svg";

export default async function Login() {
  return (
    <div className="h-full min-h-screen lg:flex lg:gap-4 lg:p-4">
      <div className="flex flex-col items-center lg:w-1/2 lg:justify-between lg:gap-[130px] lg:p-4 ">
        <div className="w-full">
          <Link href="/" className="hidden h-fit w-[200px] lg:inline-block">
            <Logo />
          </Link>
        </div>
        <LoginForm />
        <div className="hidden w-full items-center justify-between lg:flex">
          <div className="font-normal text-gray-600 text-sm leading-5">
            © IMS Technology 2024
          </div>
          <div className="flex items-center gap-2">
            <img src={emailIcon.src} alt="" className="mt-[3px] h-4 w-4" />
            <div className="font-normal text-gray-600 text-sm leading-5">
              team@cybersentry.tech
            </div>
          </div>
        </div>
      </div>
      <div className="hidden w-1/2 rounded-[20px] bg-brand-800 lg:block" />
    </div>
  );
}
