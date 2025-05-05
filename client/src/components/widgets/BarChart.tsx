"use client";
import {
  BarChart,
  Bar,
  Rectangle,
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
    name: "Water Usage",
    prev: 60,
    now: 65,
  },
  {
    name: "Production",
    prev: 62,
    now: 63,
  },
  {
    name: "Others",
    prev: 65,
    now: 70,
  },
  {
    name: "Others",
    prev: 63,
    now: 62,
  },
  {
    name: "Othersx",
    prev: 60,
    now: 63,
  },
];

const MyBarChart = () => {
  return (
    <div className="bg-primary-600 rounded-xl h-full w-full p-4">
      {/* TITLE */}
      <div className="flex justify-between align-center">
        <h1 className="font-semibold text-primary-100 text-lg">Other Stats</h1>
        <MoreHorizIcon className="text-primary-100 cursor-pointer" />
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={16}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#ccd1d1" }}
            tickLine={false}
          />
          <YAxis axisLine={false} />
          <Tooltip
            contentStyle={{
              color: "white",
              background: "#334646",
              borderRadius: "10px",
              borderColor: "lightgray",
            }}
            cursor={false}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />
          <Bar
            dataKey="now"
            fill="#15e585"
            activeBar={<Rectangle stroke="#001818" />}
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="prev"
            fill="#00d2ff"
            activeBar={<Rectangle stroke="#001818" />}
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyBarChart;
