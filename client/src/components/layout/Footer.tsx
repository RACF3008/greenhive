const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center justify-center w-full bg-primary-600 text-white font-bold text-sm h-12">
      <span>© {currentYear} GreenHive. All rights reserved</span>
    </div>
  );
};

export default Footer;
