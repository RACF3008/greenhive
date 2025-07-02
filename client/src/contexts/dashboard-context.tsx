import { createContext, useContext } from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  lastLoginAt: Date;
  id: string;
}

export const DashboardContext = createContext<User | undefined>(undefined);

export function useUserContext() {
  const user = useContext(DashboardContext);

  if (user === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return user;
}
