'use client';

import { createContext, useContext } from 'react';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};

export const CurrentUserContext = createContext<User | null>(null);

export const useCurrentUser = () => useContext(CurrentUserContext);
