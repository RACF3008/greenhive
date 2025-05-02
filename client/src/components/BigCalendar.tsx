"use client";

import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const tasks = [
  {
    title: "Task 1",
    allDay: false,
    start: new Date(2025, 4, 12, 8, 0),
    end: new Date(2025, 4, 12, 8, 45),
  },
  {
    title: "Task 2",
    allDay: false,
    start: new Date(2025, 4, 15, 9, 0),
    end: new Date(2025, 4, 15, 9, 45),
  },
  {
    title: "Task 3",
    allDay: false,
    start: new Date(2025, 4, 16, 10, 0),
    end: new Date(2025, 4, 16, 10, 45),
  },
  {
    title: "Task 4",
    allDay: false,
    start: new Date(2025, 4, 14, 11, 0),
    end: new Date(2025, 4, 14, 11, 45),
  },
  {
    title: "Task 5",
    allDay: false,
    start: new Date(2025, 4, 13, 13, 0),
    end: new Date(2025, 4, 13, 13, 45),
  },
];

const MyBigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleViewChange = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={tasks}
      startAccessor="start"
      endAccessor="end"
      views={["day", "work_week"]}
      view={view}
      style={{ height: "98%" }}
      onView={handleViewChange}
      min={new Date(2025, 4, 14, 8, 0)}
      max={new Date(2025, 4, 18, 17, 0)}
      defaultDate={new Date(2025, 4, 14)}
    />
  );
};

export default MyBigCalendar;
