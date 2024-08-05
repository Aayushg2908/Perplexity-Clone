import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Perplexity Clone",
  description:
    "This is a perplexity clone created using Nextjs for frontend and Nodejs for backend.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${inter.className} h-full dark`}>
          <Sidebar>{children}</Sidebar>
        </body>
      </html>
    </SessionProvider>
  );
}
