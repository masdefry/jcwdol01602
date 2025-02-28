import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

const BackToRegist = ({ url }: { url: string }) => {
  const router = useRouter();
  return (
    <>
      <button
        className="py-2 flex items-center gap-2 px-4 rounded-full bg-gray-200 text-gray-800 hover:text-black hover:bg-yellow-400 ease-in-out duration-150"
        onClick={() => router.push(url)}
      >
        <ArrowUturnLeftIcon className="w-5 h-5" />
        Register
      </button>
    </>
  );
};

export default BackToRegist;
