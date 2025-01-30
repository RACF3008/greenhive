import React, { useState } from 'react';
import Router from 'next/router';

import styles from './styles.module.css';
import useRequest from '../../hooks/use-request';
import SendResetEmailForm from '../../components/forms/SendResetEmailForm';

const SendResetEmail = () => {
  const [email, setEmail] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/forgot-password',
    method: 'post',
    body: {
      email,
    },
    onSuccess: () => Router.push('/auth/check-email'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Reset your Password</h1>
        <SendResetEmailForm
          email={email}
          setEmail={setEmail}
          errors={errors}
          onSubmit={onSubmit}
        />
      </div>
    </main>
  );
};

export default SendResetEmail;
