import MyCalendar from "@/components/widgets/Calendar";
import MyNotifications from "@/components/widgets/Notifications";
import MyBigCalendar from "@/components/widgets/BigCalendar";

const OperatorPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row text-white">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-primary-600 p-4 rounded-md">
          <h1 className="text-xl font-semibold">Tasks</h1>
          <MyBigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <MyCalendar />
        <MyNotifications />
      </div>
    </div>
  );
};

export default OperatorPage;
