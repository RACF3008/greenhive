import SigninForm from "../../../components/pages/auth/signin/SigninForm";

const SignupPage = () => {
  return (
    <div className="flex flex-col w-full items-center my-8">
      <h1 className="text-center mb-4 font-semibold text-2xl">
        Sign-In to your Account
      </h1>
      <SigninForm data={null} />
    </div>
  );
};

export default SignupPage;
