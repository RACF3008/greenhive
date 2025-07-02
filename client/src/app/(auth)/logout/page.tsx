"use client";

import useRequest from "@/hooks/use-request";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();

  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    onSuccess: () => router.push("/signin?msg=Logged out successgully"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Logging Out...</div>;
};

export default LogoutPage;
