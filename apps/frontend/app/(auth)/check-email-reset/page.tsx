import { decryptString } from "@/actions/auth/actions";
import ResendButton from "@/app/(auth)/check-email-reset/_components/ResendButton";
import emailIcon from "@/assets/emailIcon.svg";

async function Page({
  searchParams,
}: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const userData = searchParams.user;

  if (typeof userData !== "string") return;

  const [iv, encryptedData] = userData.split(":");

  const result = await decryptString({
    iv,
    encryptedData,
  });

  const email = result?.data?.decryptedData;

  if (!email) return;

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
            An email has been sent to your inbox to reset your password. Please
            check your inbox and follow the instructions.
          </p>
        </div>
        <ResendButton email={email} />
      </div>
    </div>
  );
}

export default Page;
