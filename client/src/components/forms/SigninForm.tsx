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
const schema = z.object({
  identifier: z.string().email({ message: 'Email or username must be valid' }),
  password: z.string().nonempty({ message: 'Password must be provided' }),
  sessionCheckbox: z.boolean().optional(),
});

type Inputs = z.infer<typeof schema>;

const SigninForm = ({ data }: { data: any }) => {
  const [error, setError] = useState('');
  const { doRequest, errors: requestErrors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    onSuccess: () => Router.push('/'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (requestErrors && typeof requestErrors === 'string') {
      setError(requestErrors);
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [requestErrors]);

  const handleOnSubmit = handleSubmit(async (formData) => {
    await doRequest(formData);
  });

  return (
    <form
      onSubmit={handleOnSubmit}
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

      <InputField
        label="Password"
        type="password"
        name="password"
        register={register}
        error={errors.password}
      />

      <SessionCheckbox
        text="Keep me signed in for 7 days"
        name="sessionCheckbox"
        register={register}
        error={errors.sessionCheckbox}
      />

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
  );
};

export default SigninForm;
