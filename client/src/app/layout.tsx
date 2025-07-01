import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GreenHive Managment Dashboard",
  description: "Dashboard to control and monitor GreenHive devices remotely",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="" lang="en">
      {/* <UserProvider valueFromServer={currentUser}> */}
      <body className={inter.className}>{children}</body>
      {/* </UserProvider> */}
    </html>
  );
}
