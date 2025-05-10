import Link from 'next/link';

const ResetPasswordEmailSentPage = () => {
  return (
    <div className="flex flex-col w-full items-center my-8">
      <h1 className="text-center mb-4 font-semibold text-2xl">
        Reset your Password
      </h1>
      <div className="bg-primary-600 p-4 flex flex-col gap-4 rounded-md w-4/5 lg:w-1/2">
        <span className="font-light text-lg">
          We've emailed you instructions for setting your password, if an
          account exists with the email you entered. You should receive them
          shortly.
        </span>
        <div className="flex items-center justify-end">
          <span className="font-light text-sm text-primary-100">
            Didn't Receive the Email?
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

export default ResetPasswordEmailSentPage;
