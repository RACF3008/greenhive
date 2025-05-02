"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
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
    .max(20, { message: "Password must have 20 or less characters" }),
  repeatPassword: z.string(),
});

const SignupForm = ({ type, data }: { type: string; data: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  return <form className="flex flex-col gap-4"></form>;
};

export default SignupForm;
