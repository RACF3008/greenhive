"use client";

import WelcomeCard from "@/components/widgets/WelcomeCard";
import { useUserContext } from "@/contexts/dashboard-context";

import QuickActionButton from "../../components/pages/dashboard/QuickActionButtons";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import AddIcon from "@mui/icons-material/Add";
import DeviceCard from "@/components/widgets/DeviceCard";
import ScrollContainer from "@/components/layout/ScrollContainer";

import { deviceData } from "@/data/deviceData";

function HomePage() {
  const user = useUserContext();

  return (
    <div className="flex flex-col lg:flex-row">
      {/* LEFT */}
      <div className="flex flex-col p-4 w-full lg:w-2/3 gap-4">
        <WelcomeCard user={user} />
        {/* QUICK ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row gap-4">
          <QuickActionButton
            icon={<AddIcon sx={{ fontSize: 32 }} />}
            label="Add New Device"
            onClick={() => console.log("Add device")}
          />
          <QuickActionButton
            icon={<AssignmentAddIcon sx={{ fontSize: 32 }} />}
            label="Create Task"
            onClick={() => console.log("Create task")}
          />
        </div>

        {/* DEVICES QUICK ACCESS */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="font-semibold text-xl text-primary-100">
            Device Quick Access
          </h1>
          <ScrollContainer>
            {deviceData.map((device) => (
              <DeviceCard key={device.id} data={device} />
            ))}
          </ScrollContainer>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3"></div>
    </div>
  );
}

export default HomePage;
