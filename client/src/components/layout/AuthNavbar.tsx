"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const AuthNavbar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between py-4 px-8 h-16 bg-primary-600">
      <Link
        href="/"
        className="flex items-center justify-center lg:justify-start gap-1"
      >
        <Image src="/logo.png" alt="logo" width={48} height={48} />
        <span className="hidden lg:flex text-white font-bold text-2xl">
          GreenHive
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <span className="hidden lg:block text-white font-light text-sm">
          {pathname === "/sign-in"
            ? "Don't have an account?"
            : "Already have an account?"}
        </span>
        <Link
          href={pathname === "/signin" ? "/signup" : "/signin"}
          className="flex items-center justify-center lg:justify-start gap-1"
        >
          <span className="text-white font-bold text-lg underline">
            {pathname === "/signin" ? "Sign-Up" : "Sign-In"}
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default AuthNavbar;
