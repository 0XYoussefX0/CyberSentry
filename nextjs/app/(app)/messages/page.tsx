import ConversationContent from "@/components/ConversationContent";
import ConversationList from "@/components/ConversationList";
import MessagesLayout from "@/components/MessagesLayout";

export default function Messages({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const roomID = searchParams.roomID ?? "";

  if (typeof roomID !== "string") return;

  //look up if passing server components as props actually makes them client components, if so then pass them as children, and find a clever way of passing them to the layout
  return (
    <MessagesLayout
      conversationList={<ConversationList />}
      conversationContent={<ConversationContent roomID={roomID} />}
      roomID={roomID}
    />
  );
}
