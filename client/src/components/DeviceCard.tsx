"use client";

import Image from "next/image";
import Link from "next/link";

type PayloadKey = {
  tag: string;
  role: "sensor" | "actuator" | string;
  display: string;
  unit: string;
  fillColor: string;
  bgColor: string;
  textColor: string;
};

const payloadKeys: Record<string, PayloadKey> = {
  tankLevel: {
    tag: "Tank Level",
    role: "sensor",
    unit: "%",
    display: "percentage",
    fillColor: "#4bb4f5",
    bgColor: "#fff",
    textColor: "#000",
  },
  humidity: {
    tag: "Humidity",
    role: "sensor",
    display: "percentage",
    unit: "%",
    fillColor: "#66e4ff",
    bgColor: "#fff",
    textColor: "#000",
  },
  temperature: {
    tag: "Temperature",
    role: "sensor",
    display: "text",
    unit: "°C",
    fillColor: "#ff8b3d",
    bgColor: "#fff",
    textColor: "#fff",
  },
  pumpOn: {
    tag: "Pump",
    role: "actuator",
    display: "bool",
    unit: "",
    fillColor: "#15e585",
    bgColor: "#ff4e4e",
    textColor: "#fff",
  },
};

interface DeviceData {
  id: string;
  type: string;
  name: string;
  description: string;
}

type DeviceCardProps = {
  deviceData: DeviceData;
};

const renderSensor = (key: string, value: string | boolean, type: string) => {
  const payload = payloadKeys[key];
  if (!payload || payload.role !== type) return null;

  switch (payload.display) {
    case "percentage":
      return (
        <div
          key={key}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-2"
        >
          <span className="text-sm text-primary-100 md:w-1/4">
            {payload.tag}
          </span>
          <div
            className="text-sm px-4 py-1 rounded-md md:w-3/5"
            style={{
              color: payload.textColor,
              background: `linear-gradient(to right, ${payload.fillColor} ${value}%, ${payload.bgColor} ${value}%)`,
            }}
          >
            {value}
            {payload.unit}
          </div>
        </div>
      );

    case "text":
      return (
        <div key={key} className="flex items-center justify-between mt-2">
          <span className="text-sm text-primary-100 w-1/4">{payload.tag}</span>
          <div
            className="text-sm px-4 py-1 rounded-md"
            style={{
              color: payload.textColor,
              backgroundColor: payload.fillColor,
            }}
          >
            {value}
            {payload.unit}
          </div>
        </div>
      );

    case "bool":
      return (
        <div key={key} className="flex items-center justify-between mt-2">
          <span className="text-sm text-primary-100 w-1/4">{payload.tag}</span>
          <div
            className="text-sm px-4 py-1 rounded-md"
            style={{
              color: payload.textColor,
              backgroundColor: value ? payload.fillColor : payload.bgColor,
            }}
          >
            {value ? "ON" : "OFF"}
          </div>
        </div>
      );

    default:
      return null;
  }
};

const DeviceCard = ({ deviceData }: DeviceCardProps) => {
  return (
    <Link href={`/devices/${deviceData.id}`}>
      <div className="relative bg-primary-400 rounded-md p-4 mt-[220px] cursor-pointer md:opacity-60 md:hover:opacity-100 transition-opacity">
        <div className="absolute -top-[75px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative w-[300px] h-[300px]">
            <Image
              src={`/${deviceData.type}.png`}
              alt="device"
              fill
              className="object-contain fade-bottom"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-md text-primary-200">
            {deviceData.type}
          </h2>
        </div>
        <h1 className="font-bold text-lg text-white">{deviceData.name}</h1>
        <span className="text-sm text-primary-200 line-clamp-3 overflow-hidden fade-out h-[60px]">
          {deviceData.description}
        </span>
        <div className="flex flex-col mt-4 w-full">
          {/* <span className="text-md text-white mb-2 font-semibold">Sensors</span>
          {Object.entries(deviceData.payload).map(([key, value]) =>
            renderSensor(key, value, 'sensor')
          )}
          <span className="text-md text-white font-semibold">Actuators</span>
          {Object.entries(deviceData.payload).map(([key, value]) =>
            renderSensor(key, value, 'actuator')
          )} */}
        </div>
      </div>
    </Link>
  );
};

export default DeviceCard;
