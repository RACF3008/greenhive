interface ComingSoonProps {
  width?: string; // Tailwind class like "w-1/2" or "w-[300px]"
  height?: string; // Tailwind class like "h-64" or "h-[400px]"
}

const ComingSoon: React.FC<ComingSoonProps> = ({ width, height }) => {
  const wClass = width || "w-full";
  const hClass = height || "h-full";

  return (
    <div
      className={`bg-primary-400 flex items-center justify-center rounded-md ${wClass} ${hClass} p-4`}
    >
      <p className="text-primary-300 font-bold">Coming Soon</p>
    </div>
  );
};

export default ComingSoon;
