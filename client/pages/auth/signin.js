import { useState } from 'react';
import SigninForm from '../../components/forms/SigninForm';
import styles from './styles.module.css';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const SigninPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      identifier,
      password,
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
        <h1 className={styles.pageTitle}>Sign In</h1>
        <SigninForm
          identifier={identifier}
          setIdentifier={setIdentifier}
          password={password}
          setPassword={setPassword}
          errors={errors}
          onSubmit={onSubmit}
        />
      </div>
    </main>
  );
};

export default SigninPage;
