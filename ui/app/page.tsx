import { auth } from "@/auth";
import ChatWindow from "@/components/chat-window";

export default async function Home() {
  const session = await auth();

  return <ChatWindow userId={session?.user?.id!} />;
}
