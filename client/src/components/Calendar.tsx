"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const urgencyBorderT: Record<string, string> = {
  high: "border-t-redAccent-400",
  medium: "border-t-yellowAccent-400",
  low: "border-t-greenAccent-400",
};

const urgencyDotBg: Record<string, string> = {
  high: "bg-redAccent-400",
  medium: "bg-yellowAccent-400",
  low: "bg-greenAccent-400",
};

const events = [
  {
    id: 1,
    title: "Lake Trip",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    urgency: "high",
  },
  {
    id: 2,
    title: "Lake Trip",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    urgency: "medium",
  },
  {
    id: 3,
    title: "Lake Trip",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    urgency: "low",
  },
];

const MyCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-primary-600 p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-primary-100 text-lg my-4">Events</h1>
        <MoreHorizIcon className="text-primary-100 cursor-pointer" />
      </div>
      <div className="flex flex-col gap-4">
        {events.map((events) => (
          <div
            className={`text-gray-300 p-5 border-2 border-primary-400 rounded-md ${
              urgencyBorderT[events.urgency] || "border-t-white"
            } hover:bg-primary-400 cursor-pointer`}
            key={events.id}
          >
            <div className="flex items-center justify-between text-white">
              <h1 className="font-semibold text-lg">{events.title}</h1>
              <div className="flex items-center gap-2">
                <span className="text-[12px] uppercase">{events.urgency}</span>
                <div
                  className={`rounded-full h-3 w-3 ${
                    urgencyDotBg[events.urgency] || "bg-white"
                  }`}
                ></div>
              </div>
            </div>
            <p className="text-sm">{events.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCalendar;
