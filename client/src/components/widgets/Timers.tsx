const Timers = () => {
  return (
    <div className="bg-primary-600 rounded-md w-full flex-1 p-4">
      <h1 className="text-xl font-semibold text-white mb-4">Pump Timers</h1>

      {/* RUNNING TIMER */}
      <div className="bg-white flex flex-col items-center justify-center p-4 rounded-t-md">
        <div className="flex gap-4 flex-col lg:flex-row items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold">01</span>
            <span className="text-lg font-semibold ml-1">Hour</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl font-bold">40</span>
            <span className="text-lg font-semibold ml-1">Min</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl font-bold">35</span>
            <span className="text-lg font-semibold ml-1">Sec</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-sm font-semibold">ON</span>
        </div>
      </div>

      {/* NEXT TIMER */}
      <div className="bg-primary-400 p-4">
        <div className="flex gap-4 flex-col lg:flex-row items-center justify-center">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-primary-100">01</span>
            <span className="text-lg ml-1 text-primary-100">Hour</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-semibold text-primary-100">40</span>
            <span className="text-lg ml-1 text-primary-100">Min</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-semibold text-primary-100">35</span>
            <span className="text-lg ml-1 text-primary-100">Sec</span>
          </div>
        </div>
      </div>

      {/* THIRD TIMER */}
      <div className="bg-primary-500 rounded-b-md p-4">
        <div className="flex gap-4 flex-col lg:flex-row items-center justify-center">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-primary-200">01</span>
            <span className="text-lg ml-1 text-primary-200">Hour</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-semibold text-primary-200">40</span>
            <span className="text-lg ml-1 text-primary-200">Min</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-semibold text-primary-200">35</span>
            <span className="text-lg ml-1 text-primary-200">Sec</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timers;
