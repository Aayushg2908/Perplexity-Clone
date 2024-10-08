import { useEffect, useState } from "react";
import { Message } from "./chat-window";
import { formatTimeDifference } from "@/lib/utils";
import { Clock, Edit, Share, Trash } from "lucide-react";

const Navbar = ({ messages }: { messages: Message[] }) => {
  const [title, setTitle] = useState<string>("");
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    if (messages.length > 0) {
      const newTitle =
        messages[0].content.length > 20
          ? `${messages[0].content.substring(0, 20).trim()}...`
          : messages[0].content;
      setTitle(newTitle);

      const newTimeAgo = formatTimeDifference(
        new Date(),
        messages[0].createdAt!
      );
      setTimeAgo(newTimeAgo);
    }
  }, [messages]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (messages.length > 0) {
        const newTimeAgo = formatTimeDifference(
          new Date(),
          messages[0].createdAt
        );
        setTimeAgo(newTimeAgo);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed text-white/70 z-40 top-0 left-0 right-0 px-4 lg:pl-[104px] lg:pr-6 lg:px-8 flex flex-row items-center justify-between w-full py-4 text-sm border-b bg-[#0A0A0A] border-[#1C1C1C]">
      <Edit
        size={17}
        className="active:scale-95 transition duration-100 cursor-pointer lg:hidden"
      />
      <div className="hidden lg:flex flex-row items-center justify-center space-x-2">
        <Clock size={17} />
        <p className="text-xs">{timeAgo} ago</p>
      </div>
      <p className="hidden lg:flex">{title}</p>
      <div className="flex flex-row space-x-4 items-center">
        <Share
          size={17}
          className="active:scale-95 transition duration-100 cursor-pointer"
        />
        <Trash
          size={17}
          className="active:scale-95 transition duration-100 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Navbar;
