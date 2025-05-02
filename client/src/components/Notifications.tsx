const MyNotifications = () => {
  return (
    <div className="bg-primary-600 rounded-md h-full w-full p-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold text-white">Notifications</h1>
        <span className="text-sm text-gray-400 cursor-pointer">View All</span>
      </div>
      {/* NOTIFICATIONS */}
      <div className="flex flex-col gap-4">
        {/* NOTIFICATION */}
        <div className="rounded-md p-4 bg-cyan-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs text-gray-500 bg-white rounded-md p-1">
              01-01-2025
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            reiciendis nemo nulla perspiciatis saepe cupiditate, explicabo
            similique, illum, quo blanditiis voluptatum maxime beatae earum
            perferendis ex. Ut sed et cumque!
          </p>
        </div>

        {/* NOTIFICATION */}
        <div className="rounded-md p-4 bg-cyan-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs text-gray-500 bg-white rounded-md p-1">
              01-01-2025
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            reiciendis nemo nulla perspiciatis saepe cupiditate, explicabo
            similique, illum, quo blanditiis voluptatum maxime beatae earum
            perferendis ex. Ut sed et cumque!
          </p>
        </div>

        {/* NOTIFICATION */}
        <div className="rounded-md p-4 bg-cyan-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs text-gray-500 bg-white rounded-md p-1">
              01-01-2025
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            reiciendis nemo nulla perspiciatis saepe cupiditate, explicabo
            similique, illum, quo blanditiis voluptatum maxime beatae earum
            perferendis ex. Ut sed et cumque!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyNotifications;
