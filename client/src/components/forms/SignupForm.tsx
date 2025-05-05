"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

/* VERIFICATION SCHEMA */
const schema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
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
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

const SignupForm = ({ data }: { data: any }) => {
  /* HOOKS */
  const { doRequest, errors: requestErrors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    onSuccess: () => Router.push("/"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [visibleError, setVisibleError] = useState("");

  useEffect(() => {
    if (requestErrors && typeof requestErrors === "string") {
      setVisibleError(requestErrors);
      const timer = setTimeout(() => setVisibleError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [requestErrors]);

  const handleOnSubmit = handleSubmit(async (formData) => {
    await doRequest(formData);
  });

  return (
    <>
      {visibleError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-md shadow-md z-50">
          {visibleError}
        </div>
      )}
      <form
        className="flex flex-col gap-4 bg-primary-700 p-4 w-3/4 md:w-1/2 rounded-md"
        onSubmit={(e) => handleOnSubmit(e)}
      >
        {/* FIRST NAME */}
        <label className="text-base text-white font-medium">First Name:</label>
        <input
          type="text"
          {...register("firstName")}
          className="ring-[1px] font-light ring-primary-300 p-2 rounded-md bg-primary-500"
        />
        {errors.firstName?.message && (
          <p className="text-xs text-redAccent-400">
            {errors.firstName.message.toString()}
          </p>
        )}

        {/* LAST NAME */}
        <label className="text-base text-white font-medium">Last Name:</label>
        <input
          type="text"
          {...register("lastName")}
          className="ring-[1px] font-light ring-primary-300 p-2 rounded-md bg-primary-500"
        />
        {errors.lastName?.message && (
          <p className="text-xs text-redAccent-400">
            {errors.lastName.message.toString()}
          </p>
        )}

        {/* USERNAME */}
        <label className="text-base text-white font-medium">Username:</label>
        <input
          type="text"
          {...register("username")}
          className="ring-[1px] font-light ring-primary-300 p-2 rounded-md bg-primary-500"
        />
        {errors.username?.message && (
          <p className="text-xs text-redAccent-400">
            {errors.username.message.toString()}
          </p>
        )}

        {/* EMAIL */}
        <label className="text-base text-white font-medium">Email:</label>
        <input
          type="text"
          {...register("email")}
          className="ring-[1px] font-light ring-primary-300 p-2 rounded-md bg-primary-500"
        />
        {errors.email?.message && (
          <p className="text-xs text-redAccent-400">
            {errors.email.message.toString()}
          </p>
        )}

        {/* PASSWORD */}
        <label className="text-base text-white font-medium">Password:</label>
        <input
          type="password"
          {...register("password")}
          className="ring-[1px] font-light ring-primary-300 p-2 rounded-md bg-primary-500"
        />
        {errors.password?.message && (
          <p className="text-xs text-redAccent-400">
            {errors.password.message.toString()}
          </p>
        )}

        {/* REPEAT PASSWORD */}
        <label className="text-base text-white font-medium">
          Repeat Password:
        </label>
        <input
          type="password"
          {...register("repeatPassword")}
          className="ring-[1px] font-light ring-primary-300 p-2 rounded-md bg-primary-500"
        />
        {errors.repeatPassword?.message && (
          <p className="text-xs text-redAccent-400">
            {errors.repeatPassword.message.toString()}
          </p>
        )}

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
