"use client";

import { useUserContext } from "@/contexts/dashboard-context";

const HomePage = () => {
  const user = useUserContext();
  return (
    <div>
      <h1 className="text-2xl text-white">Welcome, {user.firstName}</h1>
    </div>
  );
};

export default HomePage;
