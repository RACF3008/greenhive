import Search from "@/components/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddIcon from "@mui/icons-material/Add";

import FilterListIcon from "@mui/icons-material/FilterList";
import Pagination from "@/components/Pagination";
import DeviceCard from "@/components/DeviceCard";

const deviceDataList = [
  {
    id: "123442565428",
    type: "tower",
    name: "MyTower",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    payload: {
      tankLevel: 50,
      pumpOn: true,
    },
  },
  {
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
  },
  {
    id: "123442565420",
    type: "tower",
    name: "MyTower2",
    status: "error",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    payload: {
      tankLevel: 80,
      pumpOn: false,
    },
  },
  {
    id: "123442565420",
    type: "tower",
    name: "MyTower2",
    status: "maintenance",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    payload: {
      tankLevel: 80,
      pumpOn: true,
    },
  },
  {
    id: "123442565430",
    type: "tower",
    name: "MyTower2",
    status: "test",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    payload: {
      tankLevel: 80,
      pumpOn: true,
    },
  },
];

const DevicesListPage = () => {
  return (
    <div className="bg-primary-600 p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-primary-100">
          All Devices
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <Search />
          <div className="flex items-center gap-4 self-end">
            <button className="bg-yellowAccent-500 w-8 h-8 p-1 flex items-center justify-center rounded-full text-primary-600">
              <FilterListIcon />
            </button>
            <button className="bg-yellowAccent-500 w-8 h-8 p-1 flex items-center justify-center rounded-full text-primary-600">
              <SwapVertIcon />
            </button>
            <button className="bg-yellowAccent-500 w-8 h-8 p-1 flex items-center justify-center rounded-full text-primary-600">
              <AddIcon />
            </button>
          </div>
        </div>
      </div>
      {/* DEVICES */}
      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {deviceDataList.map((deviceData) => (
          <DeviceCard key={deviceData.id} deviceData={deviceData} />
        ))}
      </div>
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default DevicesListPage;
