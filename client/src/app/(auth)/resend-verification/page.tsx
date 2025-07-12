import ResendVerificationForm from "../../../components/pages/auth/resend-verification/ResendVerificationForm";

const ResendVerificationPage = () => {
  return (
    <div className="flex flex-col w-full items-center my-8">
      <h1 className="text-center mb-4 font-semibold text-2xl">
        Re-send Verification Email
      </h1>
      <ResendVerificationForm data={null} />
    </div>
  );
};

export default ResendVerificationPage;
