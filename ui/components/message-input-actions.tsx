import { CopyPlus, Globe, Pencil, ScanEye, SwatchBook } from "lucide-react";
import { Switch } from "./ui/switch";
import { cn } from "@/lib/utils";
import { SiYoutube, SiReddit } from "@icons-pack/react-simple-icons";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const focusModes = [
  {
    key: "webSearch",
    title: "All",
    description: "Searches across all of the internet",
    icon: <Globe size={20} />,
  },
  {
    key: "academicSearch",
    title: "Academic",
    description: "Search in published academic papers",
    icon: <SwatchBook size={20} />,
  },
  {
    key: "writingAssistant",
    title: "Writing",
    description: "Chat without searching the web",
    icon: <Pencil size={16} />,
  },
  {
    key: "youtubeSearch",
    title: "Youtube",
    description: "Search and watch videos",
    icon: (
      <SiYoutube
        className="h-5 w-auto mr-0.5"
        onPointerEnter={undefined}
        onPointerLeave={undefined}
      />
    ),
  },
  {
    key: "redditSearch",
    title: "Reddit",
    description: "Search for discussions and opinions",
    icon: (
      <SiReddit
        className="h-5 w-auto mr-0.5"
        onPointerEnter={undefined}
        onPointerLeave={undefined}
      />
    ),
  },
];

export const Attach = () => {
  return (
    <button
      type="button"
      className="p-2 text-white/50 rounded-xl hover:bg-[#1c1c1c] transition duration-200 hover:text-white"
    >
      <CopyPlus />
    </button>
  );
};

export const Focus = ({
  focusMode,
  setFocusMode,
}: {
  focusMode: string;
  setFocusMode: (mode: string) => void;
}) => {
  return (
    <Popover>
      <PopoverTrigger className="p-2 text-white/50 active:scale-95 rounded-xl hover:bg-[#1c1c1c] transition duration-200 hover:text-white">
        {focusMode !== "webSearch" ? (
          <div className="flex flex-row items-center space-x-1">
            {focusModes.find((mode) => mode.key === focusMode)?.icon}
            <p className="text-xs font-medium">
              {focusModes.find((mode) => mode.key === focusMode)?.title}
            </p>
          </div>
        ) : (
          <ScanEye />
        )}
      </PopoverTrigger>
      <PopoverContent className="w-full !bg-[#0A0A0A] flex flex-col gap-1 rounded-lg max-h-[200px] md:max-h-none overflow-y-auto">
        {focusModes.map((mode, i) => (
          <button
            onClick={() => setFocusMode(mode.key)}
            key={i}
            className={cn(
              "p-2 rounded-lg flex flex-col items-center justify-start text-start space-y-2 duration-100 cursor-pointer transition",
              focusMode == mode.key ? "bg-[#111111]" : "hover:bg-[#111111]"
            )}
          >
            <div
              className={cn(
                "flex flex-row items-center space-x-1",
                focusMode === mode.key ? "text-[#24A0ED]" : "text-white"
              )}
            >
              {mode.icon}
              <p className="text-sm font-medium">{mode.title}</p>
            </div>
            <p className="text-white/70 text-xs">{mode.description}</p>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export const CopilotToggle = ({
  copilotEnabled,
  setCopilotEnabled,
}: {
  copilotEnabled: boolean;
  setCopilotEnabled: (enabled: boolean) => void;
}) => {
  return (
    <div className="group flex flex-row items-center space-x-1 active:scale-95 duration-200 transition cursor-pointer">
      <Switch
        checked={copilotEnabled}
        onCheckedChange={setCopilotEnabled}
        className="bg=[#111111] border border-[#1C1C1C] relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full"
      >
        <span className="sr-only">Copilot</span>
        <span
          className={cn(
            copilotEnabled
              ? "translate-x-6 bg-[#24A0ED]"
              : "translate-x-1 bg-white/50",
            "inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full transition-all duration-200"
          )}
        ></span>
      </Switch>
      <p
        onClick={() => setCopilotEnabled(!copilotEnabled)}
        className={cn(
          "text-xs font-medium transition-colors duration-150 ease-in-out",
          copilotEnabled
            ? "text-[#24A0ED]"
            : "text-white/50 group-hover:text-white"
        )}
      >
        Copilot
      </p>
    </div>
  );
};
