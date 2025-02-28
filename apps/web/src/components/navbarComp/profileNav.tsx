import React, { useEffect, useRef, useState } from 'react';
import useAuthStore from '@/stores/authStores';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { logReg } from './navbarData';

export const ProfileNav = () => {
  const { account, clearAuth } = useAuthStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  // Function to close dropdown if click outside element
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  if (account) {
    return (
      <div className="flex space-x-4 justify-between items-center">
        <div className="relative text-nowrap font-semibold text-white text-lg">
          <h1>Hello, {account.name} !</h1>
        </div>
        <div
          className="relative rounded-full bg-blue-400 w-10 border-2 border-black overflow-hidden cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image
            src={account.avatar}
            alt={`${account.name}' avatar`}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div
          ref={profileRef}
          className={`absolute top-16 right-2 bg-white border border-gray-300 shadow-lg rounded-md w-48 transition-all duration-300 ease-in-out transform ${
            isOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-5 pointer-events-none'
          }`}
        >
          <ul className="p-2">
            {/* My Profile Link */}
            <li>
              <Link
                href="/"
                className="block p-2 text-gray-700 hover:bg-blue-300 rounded-lg hover:font-semibold"
              >
                My Profile
              </Link>
            </li>
            {/* Logout Button */}
            <li>
              <button
                onClick={() => {
                  clearAuth();
                  setIsOpen(false);
                  toast.success('Logout successfully');
                  router.refresh();
                }}
                className="block p-2 text-gray-700 hover:bg-red-400 w-full text-left rounded-lg hover:font-semibold"
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="flex space-x-4">
          {logReg.map((link, idx) => (
            <Link
              href={link.href}
              className="font-semibold bg-yellow-200 py-2 px-4 rounded-full text-gray-900 hover:bg-yellow-400 hover:text-black ease-in-out duration-200"
              key={idx}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </>
    );
  }
};
