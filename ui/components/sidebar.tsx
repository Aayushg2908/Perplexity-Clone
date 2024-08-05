"use client";

import {
  BookOpenText,
  Home,
  LogInIcon,
  LogOutIcon,
  Search,
  Settings,
  SquareIcon,
} from "lucide-react";
import Layout from "./layout";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const { data } = useSession();
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

  const handleSocialLogin = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/" });
  };

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
          <div className="flex flex-col gap-y-6 items-center">
            {data?.user?.id ? (
              <Popover>
                <PopoverTrigger>
                  <Image
                    src={data.user.image!}
                    alt="user-image"
                    width={50}
                    height={50}
                    className="size-9 rounded-full"
                  />
                </PopoverTrigger>
                <PopoverContent
                  className="w-fit p-2 rounded-xl bg-[#111111]"
                  side="right"
                >
                  <div className="flex flex-col items-start">
                    <h3 className="text-lg">{data.user.name}</h3>
                    <span className="text-neutral-500 text-sm">
                      {data.user.email}
                    </span>
                  </div>
                  <div className="mt-2 w-full h-[1px] bg-neutral-600 mb-2" />
                  <Button
                    onClick={async () => await signOut({ callbackUrl: "/" })}
                    className="w-full"
                    variant="ghost"
                  >
                    <LogOutIcon className="mr-2" />
                    Sign Out
                  </Button>
                </PopoverContent>
              </Popover>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <LogInIcon className="cursor-pointer" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[420px] bg-[#111111]">
                  <div className="w-full flex flex-col gap-y-1 items-center">
                    <h1 className="text-3xl text-blue-400">Welcome</h1>
                    <span className="text-neutral-400">
                      Sign In to continue
                    </span>
                    <Button
                      onClick={() => handleSocialLogin("google")}
                      variant="ghost"
                      className="w-2/3 rounded-full mt-5 flex items-center border"
                    >
                      <SiGoogle className="size-5" />
                      <span className="ml-3">Continue with Google</span>
                    </Button>
                    <Button
                      onClick={() => handleSocialLogin("github")}
                      variant="ghost"
                      className="w-2/3 rounded-full mt-1 flex items-center border"
                    >
                      <SiGithub className="size-5" />
                      <span className="ml-3">Continue with Github</span>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <Settings className="text-white cursor-pointer" />
          </div>
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
