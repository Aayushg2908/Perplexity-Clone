import { auth } from "@/auth";
import { db } from "@/lib/db";
import { BookOpenText, EllipsisVertical } from "lucide-react";
import Link from "next/link";
import Actions from "./actions";

const LibraryPage = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl">
        You need to be logged in to view this page.
      </div>
    );
  }

  const conversations = await db.conversation.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <div className="flex flex-col">
      <nav className="mt-4 flex items-center justify-between">
        <h1 className="text-3xl font-medium flex items-center gap-x-2">
          <BookOpenText className="size-8" />
          <span>Library</span>
        </h1>
      </nav>

      {conversations.length === 0 ? (
        <div className="mt-10 flex flex-col gap-y-4">
          <h1 className="text-xl font-semibold">
            {" "}
            You do not have any Conversations yet...
          </h1>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-y-4">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="w-full h-[60px] bg-[#111111] border-2 rounded-xl p-2 flex items-center justify-between"
            >
              <Link
                href={`/${conversation.id}`}
                className="font-bold line-clamp-1 text-xl ml-2 hover:text-blue-400 transition duration-300"
              >
                {conversation.title}
              </Link>
              <Actions title={conversation.title} id={conversation.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
