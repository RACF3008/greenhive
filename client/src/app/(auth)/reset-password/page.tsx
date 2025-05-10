import ResetPasswordForm from '@/components/forms/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <div className="flex flex-col w-full items-center my-8">
      <h1 className="text-center mb-4 font-semibold text-2xl">
        Change your Password
      </h1>
      <ResetPasswordForm data={null} />
    </div>
  );
};

export default ResetPasswordPage;
