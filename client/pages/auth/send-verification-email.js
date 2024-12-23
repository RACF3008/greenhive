import React, { useState } from 'react';
import Router from 'next/router';

import styles from './styles.module.css';
import useRequest from '../../hooks/use-request';
import SendVerificationEmailForm from '../../components/forms/SendVerificationEmailForm';

const SendVerificationEmail = () => {
  const [email, setEmail] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/send-verification-email',
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
        <h1 className={styles.pageTitle}>Send Verification Email</h1>
        <SendVerificationEmailForm
          email={email}
          setEmail={setEmail}
          errors={errors}
          onSubmit={onSubmit}
        />
      </div>
    </main>
  );
};

export default SendVerificationEmail;
