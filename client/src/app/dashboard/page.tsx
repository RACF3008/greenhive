"use client";

import WelcomeCard from "@/components/widgets/WelcomeCard";
import { useUserContext } from "@/contexts/dashboard-context";

import QuickActionButton from "../../components/pages/dashboard/QuickActionButtons";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import AddIcon from "@mui/icons-material/Add";
import DeviceCard from "@/components/widgets/DeviceCard";
import ScrollContainer from "@/components/layout/ScrollContainer";

import { deviceData } from "@/data/deviceData";
import ComingSoon from "@/components/widgets/ComingSoon";
import Link from "next/link";

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
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-xl text-primary-100">
              Device Quick Access
            </h1>
            <Link href="/dashboard/devices" className="text-primary-200">
              View All
            </Link>
          </div>
          <ScrollContainer>
            {deviceData.map((device) => (
              <Link key={device.id} href={`/dashboard/devices/${device.id}`}>
                <DeviceCard data={device} />
              </Link>
            ))}
          </ScrollContainer>
        </div>

        {/* CLUSTERS QUICK ACCESS */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="font-semibold text-xl text-primary-100">
            Cluster Quick Access
          </h1>
          <ComingSoon height="h-[300px]" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-4 w-full lg:w-1/3 p-4">
        {/* MAIN USER TASKS */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="font-semibold text-xl text-primary-100">User Tasks</h1>
          <ComingSoon height="h-[500px]" />
        </div>

        {/* PROJECT SHOWCASE */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="font-semibold text-xl text-primary-100">
            Project Showcase
          </h1>
          <ComingSoon height="h-[500px]" />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
