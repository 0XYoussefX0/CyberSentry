import Link from "next/link";

import LoginForm from "@/components/auth/LoginForm";
import Logo from "@/components/icons/Logo";

import emailIcon from "@/assets/emailIcon.svg";

export default async function Login() {
  // return (
  //   <div className="lg:p-4 lg:flex lg:gap-4 min-h-screen h-full">
  //     <div className="lg:w-1/2 flex flex-col items-center lg:gap-[130px] lg:justify-between lg:p-4 ">
  //       <div className="w-full">
  //         <Link href="/" className="h-fit w-[200px] hidden lg:inline-block">
  //           <Logo />
  //         </Link>
  //       </div>
  //       <LoginForm />
  //       <div className="justify-between items-center w-full hidden lg:flex">
  //         <div className="font-normal text-sm leading-5 text-gray-600">
  //           © IMS Technology 2024
  //         </div>
  //         <div className="flex items-center gap-2">
  //           <img src={emailIcon.src} alt="" className="w-4 h-4 mt-[3px]" />
  //           <div className="font-normal text-sm leading-5 text-gray-600">
  //             team@cybersentry.tech
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="bg-brand-800 rounded-[20px] w-1/2 hidden lg:block"></div>
  //   </div>
  // );
}
