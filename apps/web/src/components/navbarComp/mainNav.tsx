import React from 'react';
import { adminServices, devServices, services } from './navbarData';
import Link from 'next/link';
import useAuthStore from '@/stores/authStores';

const MainNav = () => {
  const { account } = useAuthStore();

  let navBarItems = null;
  if (!account || account.role === 'user') {
    navBarItems = services;
  } else if (account.role === 'developer') {
    navBarItems = devServices;
  } else if (account.role === 'admin') {
    navBarItems = adminServices;
  }
  return (
    <>
      <div className="flex gap-4 p-1">
        {navBarItems &&
          navBarItems.map((route, idx) => (
            <Link
              href={route.href}
              key={idx}
              className="relative cursor-pointer text-white transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {route.label}
            </Link>
          ))}
      </div>
    </>
  );
};
export default MainNav;
