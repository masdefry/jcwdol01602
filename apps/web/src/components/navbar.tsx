'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { logReg, services } from './navbarComp/navbarData';
import MainNav from './navbarComp/mainNav';
import { ProfileNav } from './navbarComp/profileNav';
import MobileNav from './navbarComp/mobileNav';
import Logo from './logo';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white py-3 px-4 sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <Logo />
          <div className="hidden md:block">
            <MainNav />
          </div>
        </div>
        {/* Hamburger Menu for Mobile */}
        <button
          className="ml-auto text-white focus:outline-none md:hidden hamburger-btn"
          onClick={toggleMobileMenu}
        >
          <Bars3Icon className="w-6 h-6 text-white" />
        </button>
        {/* Right Section */}
        <div className="hidden md:block space-x-4">
          <ProfileNav />
        </div>
        {/* Mobile Menu */}
        <MobileNav
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>
    </nav>
  );
};

export default Navbar;
