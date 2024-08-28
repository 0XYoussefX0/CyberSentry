import logout from "@/app/actions/(auth)/logout";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const handleLogOut = async () => {
    const response = await logout();
    if (response.status === "error") {
      toast({
        title: "Error logging out",
        description: response.message,
      });
    }
  };
  return (
    <>
      <div>Dashboard</div>
      <button onClick={() => handleLogOut()}>Log out</button>
    </>
  );
}
