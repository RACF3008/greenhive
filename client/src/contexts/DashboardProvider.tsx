// app/src/contexts/DashboardProvider.tsx
"use client";

import { DashboardContext } from "./dashboard-context";

interface Props {
  currentUser: any; // o tu interfaz User si la exportas
  children: React.ReactNode;
}

export default function DashboardProvider({ currentUser, children }: Props) {
  return (
    <DashboardContext.Provider value={currentUser}>
      {children}
    </DashboardContext.Provider>
  );
}
