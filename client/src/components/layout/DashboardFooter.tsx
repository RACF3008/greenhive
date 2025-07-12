import Image from "next/image";

const DashboardFooter = () => {
  return (
    <footer className="bg-primary-600 w-full">
      {/* LOGO AND NAME */}
      <div className="flex lg:flex-col items-center justify-center">
        <Image src="/logo.png" alt="logo" width={72} height={72} />
        <h2 className="text-white font-bold text-2xl">GreenHive</h2>
      </div>
    </footer>
  );
};

export default DashboardFooter;
