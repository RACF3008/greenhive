"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import useRequest from "@/hooks/use-request";
import InputField from "@/components/forms/InputField";
import ErrorMessages from "@/components/global/ErrorMessages";

const schema = z.object({
  email: z.string().email({ message: "Email must be valid" }),
});

type Inputs = z.infer<typeof schema>;

const ResendVerificationForm = ({ data }: { data: any }) => {
  const router = useRouter();

  const { doRequest, errors: requestErrors } = useRequest({
    url: "/api/users/send-verification",
    method: "post",
    onSuccess: () => router.push("/verification-email-sent"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const handleOnSubmit = async (formData: Inputs) => {
    await doRequest(formData);
  };

  return (
    <>
      <ErrorMessages requestErrors={requestErrors} />
      <form
        className="flex flex-col gap-4 bg-primary-700 p-4 w-3/4 md:w-1/2 rounded-md"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        {/* EMAIL */}
        <InputField
          label="E-mail"
          name="email"
          register={register}
          defaultValue={data?.email}
          error={errors.email}
        />

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="w-full md:w-auto bg-greenAccent-600 py-2 px-4 rounded-md"
          >
            Re-send Verifaction Email
          </button>
        </div>
      </form>
    </>
  );
};

export default ResendVerificationForm;
