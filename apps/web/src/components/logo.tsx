import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <>
      <Link href={'/'}>
        <h1 className="text-xl font-bold">
          Dream Jobs<span className="text-yellow-400 font-bold">!</span>
        </h1>
      </Link>
    </>
  );
};

export default Logo;
