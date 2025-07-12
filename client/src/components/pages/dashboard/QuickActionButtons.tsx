"use client";

import { ReactNode } from "react";

type QuickActionButtonProps = {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
};

const QuickActionButton = ({
  icon,
  label,
  onClick,
}: QuickActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex-1 md:flex-none flex gap-4 items-center rounded-md bg-primary-300 p-4 md:py-4 md:px-8 text-white hover:bg-primary-400 transition-colors"
    >
      {icon}
      <span className="font-semibold text-lg">{label}</span>
    </button>
  );
};

export default QuickActionButton;
