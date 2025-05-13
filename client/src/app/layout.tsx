import type { Metadata } from 'next';
import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

import buildClient from '../api/build-client';
import CurrentUserProvider from '@/providers/current-user-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GreenHive Managment Dashboard',
  description: 'Dashboard to control and monitor GreenHive devices remotely',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = buildClient();
  let currentUser = null;

  try {
    const { data } = await client.get('/api/users/currentuser');
    currentUser = data.currentUser;
  } catch (err) {
    console.error('Error fetching current user:', err);
  }

  return (
    <html className="" lang="en">
      <body className={inter.className}>
        <CurrentUserProvider currentUser={currentUser}>
          {children}
        </CurrentUserProvider>
      </body>
    </html>
  );
}
