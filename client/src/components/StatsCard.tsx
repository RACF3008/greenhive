import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

type StatsCardProps = {
  title: string;
  date: string;
  stat: string;
};

const StatsCard = ({ title, date, stat }: StatsCardProps) => {
  return (
    <div
      className={`rounded-2xl p-4 flex-1 min-w-[193px] odd:bg-greenAccent-200 even:bg-cyan-200`}
    >
      <div className="flex justify-between items-center">
        <span className="text-[12px] bg-white px-2 py-1 rounded-full text-greenAccent-600">
          {date}
        </span>
        <MoreHorizIcon className="cursor-pointer" />
      </div>
      <h1 className="text-2xl font-semibold my-4">{stat}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-600">{title}</h2>
    </div>
  );
};

export default StatsCard;
