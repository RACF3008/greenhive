"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const data = [
  {
    name: "Jan",
    now: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Feb",
    now: 3000,
    prev: 1398,
    amt: 2210,
  },
  {
    name: "Mar",
    now: 2000,
    prev: 9800,
    amt: 2290,
  },
  {
    name: "Apr",
    now: 2780,
    prev: 3908,
    amt: 2000,
  },
  {
    name: "May",
    now: 1890,
    prev: 4800,
    amt: 2181,
  },
  {
    name: "Jun",
    now: 2390,
    prev: 3800,
    amt: 2500,
  },
  {
    name: "Aug",
    now: 3490,
    prev: 4300,
    amt: 2100,
  },
  {
    name: "Sep",
    now: 3490,
    prev: 4300,
    amt: 2100,
  },
  {
    name: "Oct",
    now: 3490,
    prev: 4300,
    amt: 2100,
  },
  {
    name: "Nov",
    now: 3490,
    prev: 4300,
    amt: 2100,
  },
  {
    name: "Dec",
    now: 3490,
    prev: 4300,
    amt: 2100,
  },
];

const MyLineChart = () => {
  return (
    <div className="bg-primary-600 rounded-xl h-full w-full p-4">
      {/* TITLE */}
      <div className="flex justify-between align-center">
        <h1 className="font-semibold text-primary-100 text-lg">Other Stats</h1>
        <MoreHorizIcon className="text-primary-100 cursor-pointer" />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#ccd1d1" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#ccd1d1" }}
            tickLine={false}
            tickMargin={15}
          />
          <Tooltip
            contentStyle={{
              color: "white",
              background: "#334646",
              borderRadius: "10px",
              borderColor: "lightgray",
            }}
          />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "20px" }}
          />
          <Line
            type="monotone"
            dataKey="now"
            stroke="#15e585"
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="prev"
            stroke="#00d2ff"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyLineChart;
