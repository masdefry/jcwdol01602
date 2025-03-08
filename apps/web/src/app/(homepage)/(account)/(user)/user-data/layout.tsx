'use client';
import SideNav from '@/components/sideNav/sideNav';
import useAuthStore from '@/stores/authStores';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function UserPages({ children }: { children: React.ReactNode }) {
  const { account } = useAuthStore();
  const router = useRouter();
  if (!account) {
    setTimeout(() => router.push('/login'), 1000);
    return;
  } else if (account && account.role !== 'user') {
    toast.dismiss();
    toast.error('Unauthorized');
    setTimeout(() => router.push('/'), 1000);
    return;
  }
  return (
    <>
      <div className="flex flex-col md:flex-row h-full">
        <div className="flex md:basis-1/6">
          <SideNav />
        </div>
        <div className="md:basis-5/6">
          <main className="flex-grow">{children}</main>
        </div>
      </div>
    </>
  );
}
