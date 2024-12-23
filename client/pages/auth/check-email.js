import React from 'react';

import style from './styles.module.css';

const CheckEmailPage = () => {
  return (
    <div className={style.main}>
      <div className={style.container}>
        <h1 className={style.pageTitle}>Check your email</h1>
        <p className={style.pageInfo}>
          We've sent an email to your inbox with instructions to proceed
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
