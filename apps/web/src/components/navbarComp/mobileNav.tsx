import React, { useEffect, useRef, useState } from 'react';
import { logReg, services } from './navbarData';
import Link from 'next/link';
import useAuthStore from '@/stores/authStores';
import toast from 'react-hot-toast';

interface MobileNavProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { account, clearAuth } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.hamburger-btn')
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  return (
    <div
      className={`absolute top-14 left-0 right-0 w-full xl:hidden transition-all duration-300 ease-in-out transform ${
        isMobileMenuOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-5 pointer-events-none'
      }`}
    >
      <div
        ref={mobileMenuRef}
        className="flex flex-col space-y-3 text-center bg-white mx-4 p-4 rounded-lg shadow-md"
      >
        <div className="text-black flex flex-col">
          {services.map((link, idx) => (
            <Link
              href={link.href}
              key={idx}
              className="hover:underline cursor-pointer hover:font-bold ease-in-out duration-150 py-2"
            >
              {link.label}
            </Link>
          ))}
        </div>
        {account ? (
          <div className="text-black flex flex-col w-full items-center justify-center">
            <h1>Hallo, {account.name}</h1>
            <div className="flex flex-row space-x-4 w-1/2 py-2">
              <button className="block p-2  text-purple-600 font-medium bg-purple-100 hover:bg-purple-600 w-full rounded-full hover:text-white ease-in-out duration-150 ">
                My Profile
              </button>
              <button
                onClick={() => {
                  clearAuth();
                  toast.success('Logout successfully');
                }}
                className="block p-2 font-medium text-gray-400 bg-purple-100 hover:bg-red-500 w-full rounded-full hover:text-white ease-in-out duration-150"
              >
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            {logReg.map((link, idx) => (
              <Link
                href={link.href}
                key={idx}
                className="bg-purple-100 text-purple-600 font-medium py-2 px-4 rounded-full hover:text-white hover:bg-purple-600 ease-in-out duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
