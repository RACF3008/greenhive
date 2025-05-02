'use client';

import clsx from 'clsx';

type Props = {
  icon: any;
  onClick: () => void;
  state: boolean;
  color: string;
};

const SwitchButton = ({ icon: Icon, onClick, state, color }: Props) => {
  const baseClasses =
    'rounded-md flex flex-col w-full h-full items-center justify-center p-4 transition-all ease-in-out duration-300 hover:opacity-80';

  const bgColor = state ? color : '#667474';

  return (
    <button
      className={baseClasses}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      <Icon className="text-white" style={{ fontSize: 40 }} />
      <span className="font-bold text-white mt-4 text-lg">
        {state ? 'ON' : 'OFF'}
      </span>
    </button>
  );
};

export default SwitchButton;
