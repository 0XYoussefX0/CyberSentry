import LogoutButton from "@/app/(public)/check-email-confirmation/_components/LogoutButton";
import ResendButton from "@/app/(public)/check-email-confirmation/_components/ResendButton";
import emailIcon from "@/assets/emailIcon.svg";

async function Page() {
  return (
    <div className="rounded-xl bg-white pt-0 pb-0">
      <div className="relative flex flex-col items-center gap-6 pt-12 pb-6">
        <div className="gridd" />
        <div className="mask" />
        <div className="shadows flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 border-solid bg-white">
          <img src={emailIcon.src} alt="" />
        </div>
        <div>
          <h1 className="text-center font-semibold text-2xl text-gray-900 leading-8">
            Check your email
          </h1>
          <p className="text-center font-normal text-base text-gray-600 leading-6">
            An email has been sent to your inbox to confirm your email address.
            Please check your inbox and follow the instructions.
          </p>
        </div>
        <ResendButton />
        <LogoutButton />
      </div>
    </div>
  );
}

export default Page;
