import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import AuthProvider from '@/provider/authProvider';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </AuthProvider>
    </>
  );
}
