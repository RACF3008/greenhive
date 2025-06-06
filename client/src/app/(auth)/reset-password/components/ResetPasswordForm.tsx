"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Router from "next/router";

import useRequest from "../../../../hooks/use-request";
import PasswordField from "@/components/forms/PasswordField";
import ErrorMessage from "@/components/global/ErrorMessage";

/* VERIFICATION SCHEMA */
const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must have 8 or more characters" })
      .max(20, { message: "Password must have 20 or less characters" })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number",
      }),
    repeatPassword: z.string().nonempty({ message: "Passwords must match" }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

type Inputs = z.infer<typeof schema>;

type Props = {
  data: any;
  token: string;
};

const ResetPasswordForm = ({ data, token }: Props) => {
  /* HOOKS */
  const { doRequest, errors: requestErrors } = useRequest({
    url: "/api/auth/reset-password/" + token,
    method: "post",
    onSuccess: () => Router.push("/signin"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [visibleError, setVisibleError] = useState("");

  useEffect(() => {
    if (requestErrors && typeof requestErrors === "string") {
      setVisibleError(requestErrors);
      const timer = setTimeout(() => setVisibleError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [requestErrors]);

  /* HANDLERS */
  const handleOnSubmit = handleSubmit(async (formData) => {
    await doRequest(formData);
  });

  return (
    <>
      {visibleError && <ErrorMessage message={visibleError} />}
      <form
        className="flex flex-col gap-4 bg-primary-700 p-4 w-3/4 md:w-1/2 rounded-md"
        onSubmit={handleOnSubmit}
      >
        <PasswordField
          label="New Password"
          name="password"
          register={register}
          error={errors.password}
        />
        <PasswordField
          label="Repeat New Password"
          name="repeatPassword"
          register={register}
          error={errors.repeatPassword}
        />
        {/* SUBMIT BUTTON */}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="w-full md:w-auto bg-greenAccent-600 py-2 px-4 rounded-md"
          >
            Reset Password
          </button>
        </div>
      </form>
    </>
  );
};

export default ResetPasswordForm;
