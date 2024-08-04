import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Perplexity Clone",
  description:
    "This is a perplexity clone created using Nextjs for frontend and Nodejs for backend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-full dark`}>
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
