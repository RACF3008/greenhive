"use client";

import { useState } from "react";

import buildClient from "@/api/build-client";
import DashboardFooter from "@/components/layout/DashboardFooter";
import Menu from "@/components/layout/Menu";
import Navbar from "@/components/layout/Navbar";
import DashboardProvider from "@/contexts/DashboardProvider";
import Image from "next/image";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  currentUser: any; // replace with your actual type
}

const DashboardShell = ({ children, currentUser }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBurgerClick = () => {
    console.log("Burger clicked");
    setMenuOpen((prev) => !prev);
  };

  return (
    <DashboardProvider currentUser={currentUser}>
      <div className="h-screen flex flex-col">
        <Navbar onClick={handleBurgerClick} />

        <div className="flex flex-1">
          {/* SIDE MENU */}
          <div
            className={`fixed lg:static top-0 left-0 z-40 h-full w-[250px] p-4 bg-primary-600 transform transition-transform duration-300 ease-in-out ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 lg:flex`}
          >
            <Menu role="admin" />
          </div>

          {/* MAIN CONTENT */}
          <div className="w-[100%] lg:w-auto bg-primary-500 overflow-y-scroll flex flex-col">
            {children}
            <DashboardFooter />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default DashboardShell;
