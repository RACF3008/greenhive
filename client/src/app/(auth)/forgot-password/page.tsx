import ForgotPasswordForm from "./components/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col w-full items-center my-8">
      <h1 className="text-center mb-4 font-semibold text-2xl">
        Forgot your Password
      </h1>

      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
