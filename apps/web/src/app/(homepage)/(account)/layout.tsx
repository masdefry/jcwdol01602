import AuthProvider from '@/provider/authProvider';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
