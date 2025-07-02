import buildClient from "@/api/build-client";
import Menu from "@/components/layout/Menu";
import Navbar from "@/components/layout/Navbar";
import DashboardProvider from "@/contexts/DashboardProvider";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = buildClient();

  const res = await client.get("/api/users/currentuser");
  const currentUser = res.data.currentUser;

  return (
    <DashboardProvider currentUser={currentUser}>
      <div className="h-screen flex">
        {/* LEFT */}
        <div className="w-[14%] md:w-[10%] lg:w-[19%] xl:w-[14%] p-4 bg-primary-600">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-1"
          >
            <Image src="/logo.png" alt="logo" width={48} height={48} />
            <span className="hidden lg:block text-white font-bold text-lg">
              GreenHive
            </span>
          </Link>

          <Menu role="admin" />
        </div>

        {/* RIGHT */}
        <div className="w-[86%] md:w-[90%] lg:w-[81%] xl:w-[86%] bg-primary-500 overflow-y-scroll flex flex-col">
          <Navbar />
          {children}
        </div>
      </div>
    </DashboardProvider>
  );
}
