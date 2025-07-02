"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import useRequest from "../../../../hooks/use-request";
import InputField from "../../../../components/forms/InputField";
import Toast from "@/components/global/toast";

const schema = z.object({
  email: z.string().email({ message: "Email must be valid" }),
});

type Inputs = z.infer<typeof schema>;

const ForgotPasswordForm = () => {
  /* HOOKS */
  const router = useRouter();

  const { doRequest, errors: requestErrors } = useRequest({
    url: "/api/users/reset-password",
    method: "post",
    onSuccess: () => router.push("/reset-password-email-sent"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  /* HANDLERS */
  const handleOnSubmit = async (formData: Inputs) => {
    doRequest(formData);
  };

  return (
    <>
      <Toast type="error" message={requestErrors} />

      <form
        className="flex flex-col gap-4 bg-primary-700 p-8 w-3/4 md:w-1/2 rounded-lg"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <p className="text-base font-light mb-4 text-white">
          Enter the email address associated with your account. We will be
          sending instructions to reset your password. Once you get the email,
          do not share any of the information inside. GreenHive will never ask
          you for the information inside the email.
        </p>

        {/* EMAIL */}
        <InputField
          label="E-mail"
          name="email"
          register={register}
          error={errors.email}
        />

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="w-full md:w-auto bg-greenAccent-600 py-2 px-4 rounded-md"
          >
            Send Password Reset Email
          </button>
        </div>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
