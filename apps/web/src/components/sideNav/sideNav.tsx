import useAuthStore from '@/stores/authStores';
import React from 'react';
import { AdminSideNav, DevSideNav, ISideNavItem, UserSideNav } from './sideNavData';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

const SideNav = () => {
  const { account } = useAuthStore();
  const router = useRouter();

  let sideNavItems: ISideNavItem[] = [];
  if (!account) {
    toast.dismiss();
    toast.error('Unauthorized');
    router.push('/');
  } else if (account.role === 'developer') {
    sideNavItems = DevSideNav();
  } else if (account.role === 'user') {
    sideNavItems = UserSideNav();
  } else if (account.role === 'admin') {
    sideNavItems = AdminSideNav();
  }
  return (
    <>
      <div className="w-full h-full flex md:flex-col gap-2 bg-purple-950 p-1 md:p-4 overflow-y-auto">
        {sideNavItems.map((route, idx) => (
          <Link
            href={route.href}
            key={idx}
            className={`relative font-semibold p-2  ${
              route.active
                ? 'text-white cursor-default'
                : 'text-gray-400 hover:text-gray-100 transition-colors'
            } `}
          >
            {route.label}
          </Link>
        ))}
      </div>
    </>
  );
};

export default SideNav;
