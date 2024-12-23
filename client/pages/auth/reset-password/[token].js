import { useState } from 'react';

import styles from '../styles.module.css';
import useRequest from '../../../hooks/use-request';
import Router from 'next/router';
import ResetPasswordForm from '../../../components/forms/ResetPasswordForm';

const ResetPasswordPage = ({ token }) => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: `/api/users/reset-password/${token}`,
    method: 'post',
    body: {
      password,
      repeatPassword,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Reset Password</h1>
        <ResetPasswordForm
          password={password}
          setPassword={setPassword}
          repeatPassword={repeatPassword}
          setRepeatPassword={setRepeatPassword}
          errors={errors}
          onSubmit={onSubmit}
        />
      </div>
    </main>
  );
};

ResetPasswordPage.getInitialProps = async (context, client) => {
  const { token } = context.query;

  console.log(token);

  return { token };
};

export default ResetPasswordPage;
