import { notFound } from "next/navigation";

import ChangePasswordForm from "../../../components/pages/auth/change-password/ChangePasswordForm";

const ChangePasswordPage = async ({
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
      <ChangePasswordForm data={null} token={token} />
    </div>
  );
};

export default ChangePasswordPage;
