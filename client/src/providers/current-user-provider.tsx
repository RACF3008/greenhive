'use client';

import React, { ReactNode } from 'react';
import { CurrentUserContext } from '@/context/current-user-context'; // import the context

type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};

type Props = {
  children: ReactNode;
  currentUser: User | null;
};

export default function CurrentUserProvider({ children, currentUser }: Props) {
  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  );
}
