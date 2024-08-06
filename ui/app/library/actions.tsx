"use client";

import { deleteConversation } from "@/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopyIcon, EllipsisVertical, Trash2 } from "lucide-react";

const Actions = ({ title, id }: { title: string; id: string }) => {
  const handleDelete = async () => {
    try {
      await deleteConversation(id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="size-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-y-2 py-0 px-1">
        <DropdownMenuItem
          onSelect={() => navigator.clipboard.writeText(title)}
          className="cursor-pointer flex items-center gap-x-2"
        >
          <CopyIcon className="size-6" />
          <span>Copy Title</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={handleDelete}
          className="cursor-pointer flex items-center gap-x-2"
        >
          <Trash2 className="size-6" />
          <span>Delete Thread</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
