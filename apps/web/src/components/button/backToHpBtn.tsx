import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

export const BackToHomePage = () => {
  const router = useRouter();
  return (
    <>
      <button
        className="flex items-center gap-2 py-2 px-4 rounded-full bg-gray-200 text-gray-800 hover:text-black hover:bg-yellow-400 ease-in-out duration-150"
        onClick={() => router.push('/')}
      >
        <ArrowUturnLeftIcon className="w-5 h-5" />
        Home
      </button>
    </>
  );
};
