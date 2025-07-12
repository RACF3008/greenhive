import { useState, useEffect } from "react";

import buildClient from "@/api/build-client";
import VerificationResult from "../../../components/pages/auth/verification-result/VerificationResult";

const VerificationPage = async ({
  searchParams,
}: {
  searchParams: { token?: string };
}) => {
  const token = searchParams.token;
  let verified = false;
  let errorMessage = null;

  if (!token) {
    errorMessage = "No token provided";
  } else {
    try {
      const client = buildClient();
      const res = await client.post(`/api/users/verify/${token}`);
      if (res.status === 200) verified = true;
    } catch (err: any) {
      console.error(err?.response?.data?.errors?.[0]?.message);
      errorMessage =
        err?.response?.data?.errors?.[0]?.message || "Verification failed";
    }
  }

  return <VerificationResult verified={verified} errorMessage={errorMessage} />;
};

export default VerificationPage;
