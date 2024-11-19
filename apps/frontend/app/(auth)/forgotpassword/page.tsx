import ForgotPasswordForm from "@/app/(auth)/forgotpassword/_components/ForgotPasswordForm";

export default async function ForgotPassword() {
  return (
    <main className="relative flex h-full min-h-screen flex-col lp:items-center justify-between gap-[132px] px-4 pt-12 lp:pb-16 pb-6">
      <ForgotPasswordForm />
    </main>
  );
}
