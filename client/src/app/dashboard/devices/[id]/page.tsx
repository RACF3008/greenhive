"use client";

import { useState } from "react";

import Image from "next/image";

import WaterDropIcon from "@mui/icons-material/WaterDrop";

import SwitchButton from "@/components/SwitchButton";
import TankIndicator from "@/components/TankIndicator";
import MyLineChart from "@/components/widgets/LineChart";
import MyNotifications from "@/components/widgets/Notifications";
import Timers from "@/components/Timers";

const deviceData = {
  id: "123442565429",
  type: "tower",
  name: "MyTower1",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit.",
  status: "offline",
  payload: {
    tankLevel: 30,
    pumpOn: false,
  },
};

const DevicePage = () => {
  const [pump, setPump] = useState(false);

  const handlePumpStateChange = () => {
    setPump(!pump);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* LEFT */}
      <div className=" flex flex-col w-full md:w-2/3 gap-4 ">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* DEVICE CARD */}
          <div className="flex flex-col gap-4 bg-primary-600  rounded-md w-full lg:w-4/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between items-center">
              {/* DEVICE IMAGE */}
              <div className="relative w-full items-center min-w-[150px] max-w-[250px] aspect-square">
                <Image
                  src={`/${deviceData.type}.png`}
                  alt="device-image"
                  fill
                  className="object-contain"
                />
              </div>
              {/* DEVICE INFO */}
              <div className="h-fit w-full md:w-3/5 pr-4">
                <h2 className="font-semibold text-primary-200 text-md">
                  {deviceData.type}
                </h2>
                <h1 className="font-bold text-white  text-lg">
                  {deviceData.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-primary-200 text-sm">Owner:</span>
                  <span className="text-primary-300 text-sm">GreenHive</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-200 text-sm">
                    Software Version:
                  </span>
                  <span className="text-primary-300 text-sm">1.0.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-200 text-sm">Status:</span>
                  <span className="text-greenAccent-500 text-sm">Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-200 text-sm">Last Update:</span>
                  <span className="text-primary-300 text-sm">01/04/2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-200 text-sm">
                    Last Maintenance:
                  </span>
                  <span className="text-primary-300 text-sm">01/04/2025</span>
                </div>
              </div>
            </div>
            {/* DEVICE DESCRIPTION */}
            <div className="flex flex-col gap-2 p-4">
              <h2 className="font-semibold text-primary-100 text-md">
                Description:
              </h2>
              <p className="text-primary-200 text-sm">
                {deviceData.description}
              </p>
            </div>
          </div>
          {/* PUMP BUTTON */}
          <div className="flex flex-col items-center gap-4  rounded-md w-full lg:w-1/5 ">
            <h3 className="font-semibold text-primary-100 text-md">
              Pump Switch
            </h3>
            <div className="w-full flex-1">
              <SwitchButton
                onClick={handlePumpStateChange}
                state={pump}
                icon={WaterDropIcon}
                color="#00d2ff"
              />
            </div>
          </div>
          {/* TANK INDICATOR */}
          {/* <div className="w-1/5">
            <TankIndicator />
          </div> */}
        </div>
        {/* BOTTOM */}
        <div className="w-full h-[400px]">
          <MyLineChart />
        </div>
      </div>
      {/* RIGTH */}

      <div className="w-full md:w-1/3 h-fit">
        {/* TIMERS */}
        <Timers />
        {/* NOTIFICATIONS */}
        <MyNotifications />
      </div>
    </div>
  );
};

export default DevicePage;
