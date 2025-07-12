import Image from "next/image";
import Link from "next/link";

import React from "react";
import { ReactDOM } from "react";
import { SocialIcon } from "react-social-icons";

const DashboardFooter = () => {
  return (
    <footer className="flex flex-col lg:flex-row items-center justify-around bg-primary-600 w-full p-4 gap-4">
      {/* LOGO AND NAME */}
      <div className="flex lg:flex-col items-center justify-center lg:w-1/5 border-b-2 lg:border-r-2 lg:border-b-0 border-primary-300 pb-4 lg:pb-0">
        <Image src="/logo.png" alt="logo" width={72} height={72} />
        <h2 className="text-white font-bold text-2xl">GreenHive</h2>
      </div>

      {/* TERMS AND POLICY COLUMN */}
      <div className="flex flex-col items-center justify-center gap-2 lg:w-1/5">
        <h2 className="text-white font-bold text-lg mb-2">Terms and Policy</h2>
        <Link href="/terms-of-use" className="text-primary-100">
          Terms of Use
        </Link>
        <Link href="/privacy-policy" className="text-primary-100">
          Privacy Policy
        </Link>
      </div>

      {/* COSTUMER SERVICE */}
      <div className="flex flex-col items-center justify-center gap-2 lg:w-1/5">
        <h2 className="text-white font-bold text-lg mb-2">Costumer Service</h2>
        <Link href="/customer-forum" className="text-primary-100">
          Customer Forum
        </Link>
        <Link href="/make-a-question" className="text-primary-100">
          Make a Question
        </Link>
        <Link href="/contact-customer-service" className="text-primary-100">
          Contact Customer Service
        </Link>
      </div>

      {/* REACH TO US */}
      <div className="flex flex-col items-center justify-center gap-2 lg:w-2/5">
        <h2 className="text-white font-bold text-lg mb-2">Reach to Us</h2>
        <Link href="/contact-customer-service" className="text-primary-100">
          Contact Customer Service
        </Link>
        <Link
          href="/contact-customer-service"
          className="text-primary-100 mb-2"
        >
          Get in Touch!
        </Link>
        <div className="flex items-center gap-4">
          <SocialIcon
            url="www.facebook.com"
            href="https://www.facebook.com/rodrigo.cruz.364258"
          />
          <SocialIcon url="www.instagram.com" />
          <SocialIcon url="www.youtube.com" />
          <SocialIcon url="www.tiktok.com" />
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
