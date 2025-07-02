"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import useRequest from "@/hooks/use-request";
import InputField from "@/components/forms/InputField";
import { CheckboxField as TermsCheckbox } from "@/components/forms/CheckboxField";
import PasswordField from "@/components/forms/PasswordField";
import ErrorMessages from "@/components/global/ErrorMessages";

/* VERIFICATION SCHEMA */
const schema = z
  .object({
    firstName: z.string().nonempty({ message: "First name is required" }),
    lastName: z.string().nonempty({ message: "Last name is required" }),
    username: z
      .string()
      .min(8, { message: "Username must have 8 or more characters" })
      .max(20, { message: "Username must have 20 or less characters" }),
    email: z.string().email({ message: "Email must be valid" }),
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
    repeatPassword: z
      .string()
      .nonempty({ message: "Please repeat your password" }),
    termsAndConditions: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

type Inputs = z.infer<typeof schema>;

const SignupForm = ({ data }: { data: any }) => {
  /* HOOKS */
  const router = useRouter();

  const { doRequest, errors: requestErrors } = useRequest({
    url: "/api/users/signup",
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

  /* HANDLERS */
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
        {/* FIRST NAME */}
        <InputField
          label="First Name"
          name="firstName"
          register={register}
          defaultValue={data?.firstName}
          error={errors.firstName}
        />

        {/* LAST NAME */}
        <InputField
          label="Last Name"
          name="lastName"
          register={register}
          defaultValue={data?.lastName}
          error={errors.lastName}
        />

        {/* USERNAME */}
        <InputField
          label="Username"
          name="username"
          register={register}
          defaultValue={data?.username}
          error={errors.username}
        />

        {/* EMAIL */}
        <InputField
          label="E-mail"
          name="email"
          register={register}
          defaultValue={data?.email}
          error={errors.email}
        />

        {/* PASSWORD */}
        <PasswordField
          label="Password"
          name="password"
          register={register}
          defaultValue={data?.password}
          error={errors.password}
        />

        {/* REPEAT PASSWORD */}
        <PasswordField
          label="Repeat Password"
          name="repeatPassword"
          register={register}
          defaultValue={data?.repeatPassword}
          error={errors.repeatPassword}
        />

        {/* TERMS AND CONDITIONS */}
        <TermsCheckbox
          text={
            <>
              I agree to the{" "}
              <Link href="/terms-and-conditions" className="underline">
                Terms and Conditions
              </Link>
            </>
          }
          name="termsAndConditions"
          register={register}
          error={errors.termsAndConditions}
        />

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="w-full md:w-auto bg-greenAccent-600 py-2 px-4 rounded-md"
          >
            Create Account
          </button>
        </div>
      </form>
    </>
  );
};

export default SignupForm;
