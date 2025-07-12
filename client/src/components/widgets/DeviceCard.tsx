import Image from "next/image";

type DeviceData = {
  id: string;
  name: string;
  type: string;
  description?: string;
  imageUrl?: string;
};

const DeviceCard = ({ data }: { data: DeviceData }) => {
  return (
    <div className="flex p-4 bg-primary-600 rounded-md w-full lg:w-[600px]  flex-shrink-0">
      {/* DEVICE IMAGE */}
      <div className="w-1/3 relative aspect-square">
        <Image
          src={data.imageUrl || "/tower.png"}
          alt="Device image"
          fill
          className="object-contain"
        />
      </div>

      {/* DEVICE INFO */}
      <div className="flex flex-col w-2/3 pl-3">
        <h3 className="text-primary-200">{data.type}</h3>
        <h1 className="text-primary-100 text-xl font-bold">{data.name}</h1>
        <p className="text-primary-200 text-md relative max-h-24 md:max-h-48 overflow-hidden after:absolute after:bottom-0 after:left-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-primary-600 after:to-transparent">
          {data.description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default DeviceCard;
