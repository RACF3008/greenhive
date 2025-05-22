import axios from "axios";
import { notFound } from "next/navigation";

import ResetPasswordForm from "./components/ResetPasswordForm";

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: { token?: string };
}) => {
  const token = searchParams.token;

  if (!token) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full items-center my-8">
      <h1 className="text-center mb-4 font-semibold text-2xl">
        Change your Password
      </h1>
      <ResetPasswordForm data={null} token={token} />
    </div>
  );
};

export default ResetPasswordPage;
