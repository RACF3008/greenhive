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
import Toast from "@/components/global/toast";

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
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string[]>([]);

  const { doRequest, errors: requestErrors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    onSuccess: () => router.push("/dashboard"),
  });

  useEffect(() => {
    const msg = searchParams.get("msg");
    if (msg) {
      setSuccessMessage([msg]);
    }

    const err = searchParams.get("err");
    if (err) {
      setErrorMessage([err]);
    }
  }, [searchParams]);

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
      {/* TOASTS */}
      <Toast type="success" message={successMessage} />
      <Toast type="error" message={requestErrors} />
      <Toast type="error" message={errorMessage} />

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
