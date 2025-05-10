import Link from 'next/link';

const VerificationEmailSentPage = () => {
  return (
    <div className="flex flex-col w-full items-center justify-center ">
      <h1 className="text-2xl text-center mb-4">Verify Your Account</h1>
      <div className="bg-primary-600 p-4 flex flex-col gap-4 rounded-md w-4/5 lg:w-1/2">
        <span className="font-light text-lg">
          Thanks for creating an account! We've emailed you instructions to
          verify your account before using our services.
        </span>
        <div className="flex items-center justify-end">
          <span className="font-light text-sm text-primary-100">
            Haven't received an email?
          </span>
          <Link
            href="/check-email"
            className="ml-2 underline text-sm text-white"
          >
            Resend
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerificationEmailSentPage;
