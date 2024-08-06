import { BookOpenText } from "lucide-react";

const LibraryPage = () => {
  return (
    <div className="flex flex-col">
      <nav className="mt-4 flex items-center justify-between">
        <h1 className="text-3xl font-medium flex items-center gap-x-2">
          <BookOpenText className="size-8" />
          <span>Library</span>
        </h1>
      </nav>
    </div>
  );
};

export default LibraryPage;
