"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Document } from "@langchain/core/documents";
import { revalidatePath } from "next/cache";

export const createConversation = async (title: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/");
  }

  const conversation = await db.conversation.create({
    data: {
      userId: session.user.id,
      title,
    },
    select: {
      id: true,
    },
  });

  revalidatePath("/library");

  return conversation.id;
};

export const createMessage = async ({
  conversationId,
  userMessage,
  assistantMessage,
  sources,
}: {
  conversationId: string;
  userMessage: string;
  assistantMessage: string;
  sources: Document[];
}) => {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/");
  }

  await db.message.create({
    data: {
      userId: session.user.id,
      conversationId,
      content: userMessage,
      role: "user",
      sources: JSON.stringify(sources),
    },
  });

  await db.message.create({
    data: {
      userId: session.user.id,
      conversationId,
      content: assistantMessage,
      role: "assistant",
      sources: JSON.stringify(sources),
    },
  });
};

export const deleteConversation = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/");
  }

  await db.conversation.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });

  return revalidatePath("/library");
};
