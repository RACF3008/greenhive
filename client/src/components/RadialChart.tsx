'use client';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Total',
    count: 14,
    fill: '#001313',
  },
  {
    name: 'LOW',
    count: 10,
    fill: '#44ea9d',
  },
  {
    name: 'MEDIUM',
    count: 3,
    fill: '#fde355',
  },
  {
    name: 'HIGH',
    count: 1,
    fill: '#ff7171',
  },
];

const MyRadialChart = () => {
  return (
    <div className="bg-primary-600 rounded-xl h-full w-full p-4">
      {/* TITLE */}
      <div className="flex justify-between align-center">
        <h1 className="font-semibold text-primary-100 text-lg">
          Tasks Urgency
        </h1>
        <MoreHorizIcon className="text-primary-100 cursor-pointer" />
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={20}
            data={data}
          >
            <RadialBar
              dataKey="count"
              stroke="none"
              background={{ fill: '#334646' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <AssignmentIcon
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-300"
          sx={{ width: 36, height: 36 }}
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 rounded-full bg-greenAccent-400"></div>
          <h1 className="font-bold text-white">10</h1>
          <h2 className="text-xs text-primary-200">LOW</h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 rounded-full bg-yellowAccent-400"></div>
          <h1 className="font-bold text-white">3</h1>
          <h2 className="text-xs text-primary-200">MEDIUM</h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 rounded-full bg-redAccent-400"></div>
          <h1 className="font-bold text-white">1</h1>
          <h2 className="text-xs text-primary-200">HIGH</h2>
        </div>
      </div>
    </div>
  );
};

export default MyRadialChart;
