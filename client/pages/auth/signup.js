import { useState } from 'react';
import SignupForm from '../../components/forms/SignupForm';
import styles from './styles.module.css';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      firstName,
      lastName,
      email,
      username,
      password,
      repeatPassword,
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
        <h1 className={styles.pageTitle}>Sign Up</h1>
        <SignupForm
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          username={username}
          setUsername={setUsername}
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

export default SignupPage;
