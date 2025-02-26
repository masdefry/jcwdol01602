import React from 'react';
import { services } from './navbarData';
import Link from 'next/link';

const MainNav = () => {
  return (
    <>
      <div className="flex gap-4 p-1">
        {services.map((route, idx) => (
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
