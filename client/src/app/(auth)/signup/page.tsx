import SignupForm from '@/components/forms/SignupForm';

const SignupPage = () => {
  return (
    <div className="flex flex-col w-full items-center my-8">
      <h1 className="text-center mb-4 font-semibold text-2xl">
        Create New Account
      </h1>
      <SignupForm data={null} />
    </div>
  );
};

export default SignupPage;
