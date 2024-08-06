import { auth } from "@/auth";
import ChatWindow from "@/components/chat-window";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Document } from "@langchain/core/documents";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  suggestions?: string[];
  sources?: Document[];
  createdAt: Date;
}

const ConversationPage = async ({
  params,
}: {
  params: { conversationId: string };
}) => {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/library");
  }

  const { conversationId } = params;
  const conversation = await db.conversation.findUnique({
    where: {
      id: conversationId,
      userId: session.user.id,
    },
  });
  if (!conversation) {
    return notFound();
  }

  const messages = await db.message.findMany({
    where: {
      conversationId: conversation.id,
      userId: session.user.id,
    },
  });

  const finalMessages: Message[] = messages.map((message) => ({
    id: message.id,
    content: message.content,
    role: message.role as "user" | "assistant",
    sources: JSON.parse(message.sources) as Document[],
    createdAt: message.createdAt,
  }));

  const chatHistory: [string, string][] = messages.map((message) => {
    if (message.role === "user") {
      return ["human", message.content];
    } else {
      return ["assistant", message.content];
    }
  });

  return (
    <ChatWindow
      userId={session.user.id!}
      finalMessages={finalMessages}
      finalChatHistory={chatHistory}
    />
  );
};

export default ConversationPage;
