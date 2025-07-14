"use client";

import Image from "next/image";
import Link from "next/link";
import SearchInput from "../common/SearchInput";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useUserContext } from "@/contexts/dashboard-context";

interface NavbarProps {
  onClick: () => void;
}

const Navbar = ({ onClick }: NavbarProps) => {
  const user = useUserContext();
  return (
    <div className="flex flex-1 items-center justify-between p-4 bg-primary-600">
      {/* BURGER MENU */}
      <button onClick={onClick}>
        <MenuIcon
          className="lg:hidden text-primary-100 mr-4 hover:cursor-pointer"
          sx={{ fontSize: 40 }}
        />
      </button>

      {/* LOGO */}
      <Link
        href="/"
        className="flex items-center justify-center lg:justify-start gap-1 lg:w-[300px] mr-6"
      >
        <div className="relative min-w-12 min-h-12">
          <Image src="/logo.png" alt="logo" fill className="object-contain" />
        </div>
        <span className="hidden lg:block text-white font-bold text-xl">
          GreenHive
        </span>
      </Link>

      {/* SEARCH BAR */}
      <div className="hidden lg:flex lg:w-2/3">
        <SearchInput />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* ICONS */}
        <div className="hidden sm:flex rounded-full w-7 h-7  items-center justify-center cursor-pointer">
          <LocalPostOfficeIcon
            className="text-primary-100"
            sx={{ fontSize: 30 }}
          />
        </div>
        <div className="hidden sm:flex relative rounded-full w-7 h-7 items-center justify-center cursor-pointer">
          <AnnouncementIcon
            className="text-primary-100"
            sx={{ fontSize: 30 }}
          />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-sm">
            1
          </div>
        </div>

        {/* USER */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-md leading-3 font-medium text-primary-100 text-right mb-1">
              {user.username}
            </span>
            <span className="text-sm leading-3 text-primary-200 text-right">
              {user.email}
            </span>
          </div>
          <AccountCircleIcon sx={{ fontSize: 48, color: "white" }} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
