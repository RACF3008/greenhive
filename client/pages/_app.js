import React from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

import buildClient from '../api/build-client';

import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header currentUser={currentUser} />
      <div style={{ height: '6rem' }}></div>
      <Component currentUser={currentUser} {...pageProps} />
      <Footer />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
