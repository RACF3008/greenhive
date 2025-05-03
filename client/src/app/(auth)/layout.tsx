import AuthNavbar from '@/components/layout/AuthNavbar';
import Footer from '@/components/layout/Footer';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-primary-500 overflow-hidden text-white font-bold text-lg">
      <AuthNavbar />
      <div className="flex flex-1 items-center justify-center">{children}</div>
      <Footer />
    </div>
  );
}
