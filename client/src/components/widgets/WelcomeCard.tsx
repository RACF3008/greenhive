function WelcomeCard({ user }: any) {
  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-r from-[#15e585] to-[#00d2ff] p-4 rounded-md">
      <div className="">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-black text-md">
          GreenHive is a smart platform that lets you monitor and control your
          crop-growing systems from anywhere. Check insights and grow healthier
          plants, save resources, and grow delicious crops to your table — all
          from one powerful dashboard.
        </p>
        <div className="flex flex-col md:flex-row gap-4 min-w-400px min-h-400px mt-4">
          <button className="px-4 py-2 border-4 border-white  rounded-full text-white hover:bg-white hover:text-primary-600 transition-all ease-in-out">
            Master GreenHive App
          </button>
          <button className="px-8 py-2 bg-white rounded-full hover:opacity-80 transition-all ease-in-out">
            Buy Products
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeCard;
