import StatsCard from "@/components/widgets/StatsCard";
import MyBarChart from "@/components/widgets/BarChart";
import MyRadialChart from "@/components/widgets/RadialChart";
import MyLineChart from "@/components/widgets/LineChart";
import MyCalendar from "@/components/widgets/Calendar";
import MyNotifications from "@/components/widgets/Notifications";

const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* STATS CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <StatsCard title="Connected" date="01/01/2099" stat="24" />
          <StatsCard title="Maintainance" date="01/01/2099" stat="3" />
          <StatsCard title="Disconnected" date="01/01/2099" stat="2" />
          <StatsCard title="Productivity" date="01/01/2099" stat="90%" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col xl:flex-row">
          {/* RADIAL CHART */}
          <div className="w-full xl:w-1/3 h-[450px]">
            <MyRadialChart />
          </div>
          {/* BAR CHART */}
          <div className="w-full xl:w-2/3 h-[450px]">
            <MyBarChart />
          </div>
        </div>
        {/* BOTTOM CHARTS */}
        <div className="w-full h-[500px]">
          <MyLineChart />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <MyCalendar />
        <MyNotifications />
      </div>
    </div>
  );
};

export default AdminPage;
