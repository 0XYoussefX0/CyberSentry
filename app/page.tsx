import auth from "@/lib/auth";
import LogOutButton from "@/components/LogOutButton";

export default async function Home() {
  // if (
  //   !user.user_metadata.avatar_image ||
  //   !user.user_metadata.full_name ||
  //   !user.user_metadata.phoneNumber
  // ) {
  //   redirect("/onboarding");
  // }

  return (
    <>
      <div>Dashboard</div>
      <LogOutButton />
    </>
  );
}
