"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ErrorMessage from "@/components/global/ErrorMessage";

type Props = {
  verified: boolean;
  errorMessage: string;
};

const VerificationResult = ({ verified, errorMessage }: Props) => {
  const [visibleError, setVisibleError] = useState(errorMessage);

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setVisibleError(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  return (
    <>
      {visibleError && <ErrorMessage message={visibleError} />}
      <div className="flex flex-col w-full items-center my-8">
        <h1 className="text-center mb-4 font-semibold text-2xl">
          {verified ? "Account Verified" : "Account Verification Failed"}
        </h1>
        <div className="bg-primary-600 p-4 flex flex-col gap-4 rounded-md w-4/5 lg:w-1/2">
          <span className="font-light text-lg">
            {verified
              ? "Congratulations! Your account has been verified successfully. You can now start using our services."
              : "We weren't able to verify your account. Make sure to click on the link located in the email we sent you. If the error persists, please try again by clicking the link below."}
          </span>
          {!verified && (
            <div className="flex items-center justify-end">
              <span className="font-light text-sm text-primary-100">
                Didn't Receive the Email?
              </span>
              <Link
                href="/check-email"
                className="ml-2 underline text-sm text-white"
              >
                Resend
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerificationResult;
