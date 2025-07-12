"use client";

import SearchInput from "../common/SearchInput";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useUserContext } from "@/contexts/dashboard-context";

const Navbar = () => {
  const user = useUserContext();
  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <SearchInput />

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
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
