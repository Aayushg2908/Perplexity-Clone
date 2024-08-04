"use client";

import { BookOpenText, Home, Search, Settings, SquareIcon } from "lucide-react";
import Layout from "./layout";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const navLinks = [
    {
      icon: Home,
      href: "/",
      active: pathname === "/",
      label: "Home",
    },
    {
      icon: Search,
      href: "/",
      active: pathname.includes("discover"),
      label: "Discover",
    },
    {
      icon: BookOpenText,
      href: "/",
      active: pathname.includes("library"),
      label: "Library",
    },
  ];
  return (
    <>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-20 lg:flex-col">
        <div className="flex grow flex-col items-center justify-between gap-y-5 overflow-y-auto bg-[#111111] px-2 py-8">
          <Link href="/">
            <SquareIcon className="text-white cursor-pointer" />
          </Link>
          <div className="flex flex-col items-center gap-y-3 w-full">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={cn(
                  "relative flex flex-row items-center justify-center cursor-pointer hover:bg-white/10 hover:text-white duration-150 transition w-full py-2 rounded-lg",
                  link.active ? "text-white" : "text-white/60"
                )}
              >
                <link.icon />
                {link.active && (
                  <div className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-white" />
                )}
              </Link>
            ))}
          </div>
          <Settings className="text-white cursor-pointer" />
        </div>
      </div>
      <div className="fixed bottom-0 flex flex-row w-full z-50 items-center gap-x-6 bg-[#111111] px-4 py-4 shadow-sm lg:hidden">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className={cn(
              "relative flex flex-col items-center space-y-1 text-center w-full",
              link.active ? "text-white" : "text-white/70"
            )}
          >
            {link.active && (
              <div className="absolute top-0 -mt-4 w-full h-1 rounded-l-lg bg-white" />
            )}
            <link.icon />
            <p className="text-xs">{link.label}</p>
          </Link>
        ))}
      </div>
      <Layout>{children}</Layout>
    </>
  );
};

export default Sidebar;
