'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';
import InputField from './InputField';
import { CheckboxField as SessionCheckbox } from './CheckboxField';

/* VERIFICATION SCHEMA */
const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must have 8 or more characters' })
      .max(20, { message: 'Password must have 20 or less characters' })
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((val) => /[0-9]/.test(val), {
        message: 'Password must contain at least one number',
      }),
    repeatPassword: z.string().nonempty({ message: 'Passwords must match' }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  });

type Inputs = z.infer<typeof schema>;

const ResetPasswordForm = ({ data }: { data: any }) => {
  /* HOOKS */
  const { doRequest, errors: requestErrors } = useRequest({
    url: '/api/auth/reset-password/:id',
    method: 'post',
    onSuccess: () => Router.push('/signin'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [visibleError, setVisibleError] = useState('');

  useEffect(() => {
    if (requestErrors && typeof requestErrors === 'string') {
      setVisibleError(requestErrors);
      const timer = setTimeout(() => setVisibleError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [requestErrors]);

  const handleOnSubmit = handleSubmit(async (formData) => {
    await doRequest(formData);
  });

  return (
    <form
      className="flex flex-col gap-4 bg-primary-700 p-4 w-3/4 md:w-1/2 rounded-md"
      onSubmit={handleOnSubmit}
    >
      <InputField
        label="New Password"
        name="password"
        type="password"
        register={register}
        error={errors.password}
      />
      <InputField
        label="Repeat New Password"
        name="repeatPassword"
        type="password"
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
  );
};

export default ResetPasswordForm;
