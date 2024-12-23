import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import styles from './verify-account.module.css';

const VerifyAccount = ({ verifyOk }) => {
  const router = useRouter();

  const handleRedirect = (route) => {
    router.push(route);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Verify Account</h1>
      <p className={styles.description}>
        {verifyOk ? 'Verification Successful' : 'Verification Failed, please'}
      </p>
      {verifyOk ? (
        <button
          className={styles.button}
          onClick={() => handleRedirect('/auth/signin')}
        >
          Go to Signin
        </button>
      ) : (
        <button
          className={styles.button}
          onClick={() => handleRedirect('/auth/send-verification-email')}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

VerifyAccount.getInitialProps = async (context, client) => {
  const { token } = context.query;
  try {
    await client.post(`/api/users/verify-account/${token}`);
    return { verifyOk: true };
  } catch (error) {
    return { verifyOk: false };
  }
};

export default VerifyAccount;
