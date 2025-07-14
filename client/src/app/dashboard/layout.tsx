import buildClient from "@/api/build-client";
import DashboardFooter from "@/components/layout/DashboardFooter";
import Menu from "@/components/layout/Menu";
import Navbar from "@/components/layout/Navbar";
import DashboardProvider from "@/contexts/DashboardProvider";
import Image from "next/image";
import Link from "next/link";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = buildClient();

  const res = await client.get("/api/users/currentuser");
  const currentUser = res.data.currentUser;

  const handleBurgerClick = () => {};

  return <DashboardShell currentUser={currentUser}>{children}</DashboardShell>;
}
