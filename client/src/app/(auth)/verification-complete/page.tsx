import VerificationResult from "./components/VerificationResult";
import { notFound } from "next/navigation";
import axios from "axios";

const VerificationCompletePage = async ({
  searchParams,
}: {
  searchParams: { token?: string };
}) => {
  const token = searchParams.token;

  if (!token) {
    notFound();
  }

  let verified = false;
  let errorMessage = "";

  try {
    await axios.post(
      `${process.env.API_URL}/api/users/verify-account/${token}`
    );
    verified = true;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendError = error.response?.data;
      if (backendError?.errors?.[0]?.message) {
        errorMessage = backendError.errors[0].message;
      } else if (backendError?.message) {
        errorMessage = backendError.message;
      } else {
        errorMessage = "Unexpected server error.";
      }
    } else {
      errorMessage = error.message || "Unknown error occurred.";
    }
  }

  return <VerificationResult verified={verified} errorMessage={errorMessage} />;
};

export default VerificationCompletePage;
