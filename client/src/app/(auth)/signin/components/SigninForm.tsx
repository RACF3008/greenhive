"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import useRequest from "../../../../hooks/use-request";
import InputField from "../../../../components/forms/InputField";
import { CheckboxField as SessionCheckbox } from "../../../../components/forms/CheckboxField";
import PasswordField from "@/components/forms/PasswordField";
import Link from "next/link";

/* VERIFICATION SCHEMA */
const schema = z.object({
  identifier: z
    .string()
    .nonempty({ message: "Email or username must be valid" }),
  password: z.string().nonempty({ message: "Password must be provided" }),
  sessionCheckbox: z.boolean().optional(),
});

type Inputs = z.infer<typeof schema>;

const SigninForm = ({ data }: { data: any }) => {
  const searchParams = useSearchParams();

  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [visibleError, setVisibleError] = useState("");

  const { doRequest, errors: requestErrors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    onSuccess: () => router.push("/dashboard"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const message = searchParams.get("msg");
    if (message) {
      setSuccessMessage(message);
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }

    const urlError = searchParams.get("err");
    if (urlError) {
      setSuccessMessage(urlError);
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    if (requestErrors && typeof requestErrors === "string") {
      setVisibleError(requestErrors);
      const timer = setTimeout(() => setVisibleError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [requestErrors]);

  const handleOnSubmit = async (formData: Inputs) => {
    doRequest(formData);
  };

  return (
    <>
      {visibleError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-md shadow-md z-50">
          {visibleError}
        </div>
      )}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-md z-50">
          {successMessage}
        </div>
      )}
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col gap-4 bg-primary-700 p-4 w-3/4 md:w-1/2 rounded-md"
      >
        <InputField
          label="Email or Username"
          type="text"
          name="identifier"
          register={register}
          defaultValue={data?.identifier}
          error={errors.identifier}
        />

        <PasswordField
          label="Password"
          name="password"
          register={register}
          error={errors.password}
        />

        <div className="flex justify-between">
          <SessionCheckbox
            text="Keep me signed in for 7 days"
            name="sessionCheckbox"
            register={register}
            error={errors.sessionCheckbox}
          />
          <Link
            href="/forgot-password"
            className="underline text-sm text-white text-end"
          >
            Forgot your Password?
          </Link>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="w-full md:w-auto bg-greenAccent-600 py-2 px-4 rounded-md text-white"
          >
            Sign In
          </button>
        </div>

        {error && <p className="text-redAccent-400 mt-2">{error}</p>}
      </form>
    </>
  );
};

export default SigninForm;
