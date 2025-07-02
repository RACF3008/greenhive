"use client";

import SearchIcon from "@mui/icons-material/Search";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useUserContext } from "@/contexts/dashboard-context";

const Navbar = () => {
  const user = useUserContext();
  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-primary-300 px-2">
        <SearchIcon className="text-primary-300" sx={{ fontSize: 24 }} />
        <input
          type="text"
          placeholder="Search"
          className="w-[200px] bg-transparent p-2 outline-none text-white"
        />
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <LocalPostOfficeIcon
            className="text-primary-100"
            sx={{ fontSize: 24 }}
          />
        </div>
        <div className="relative rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <AnnouncementIcon
            className="text-primary-100"
            sx={{ fontSize: 24 }}
          />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-sm">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium text-primary-100 text-right">
            {user.username}
          </span>
          <span className="text-[10px] leading-3 text-primary-200 text-right">
            {user.email}
          </span>
        </div>
        <AccountCircleIcon sx={{ fontSize: 36, color: "white" }} />
      </div>
    </div>
  );
};

export default Navbar;
