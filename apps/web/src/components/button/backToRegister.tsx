import React from 'react';
import { useRouter } from 'next/navigation';

const BackToRegist = ({ url }: { url: string }) => {
  const router = useRouter();
  return (
    <>
      <button
        className="py-2 px-4 rounded-full bg-gray-200 text-gray-800 hover:text-black hover:bg-yellow-400 ease-in-out duration-150"
        onClick={() => router.push(url)}
      >
        Register
      </button>
    </>
  );
};

export default BackToRegist;
