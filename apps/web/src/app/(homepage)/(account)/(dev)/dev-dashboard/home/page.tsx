'use client';
import Logo from '@/components/logo';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

const DevDashBoard = () => {
  return (
    <div className="flex justify-center items-center md:h-[calc(100vh-5rem-16rem)]">
      <div className=" flex flex-col justify-center items-center bg-gradient-to-tr from from-fuchsia-600 to-purple-600 p-4 rounded-lg text-white shadow-lg">
        <Logo />
        <h1 className="text-xl font-semibold">
          Welcome to Developer Dashboard
        </h1>
      </div>
    </div>
  );
};

export default DevDashBoard;
