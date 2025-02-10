'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFiturKamiOpen, setIsFiturKamiOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleFiturKami = () => {
    setIsFiturKamiOpen(!isFiturKamiOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white py-3 px-6 sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <Link href={'/'}>
          <h1 className="text-xl font-bold">Dream Job!</h1>
          </Link>
          <ul className="hidden md:flex space-x-6">
            <li className="hover:underline cursor-pointer">
              <Link href="/loker">Loker</Link>
            </li>
            <li className="hover:underline cursor-pointer">
              <Link href="/perusahaan">Perusahaan</Link>
            </li>
            <li className="hover:underline cursor-pointer">
              <Link href="/cv-generator">CV Generator</Link>
            </li>
          </ul>
        </div>
        {/* Hamburger Menu for Mobile */}
        <button
          className="ml-auto text-white focus:outline-none xl:hidden"
          onClick={toggleMobileMenu}
        >
          <Bars3Icon className="w-6 h-6 text-white" />
        </button>
        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <div className="hidden xl:block space-x-4">
            <a className="hover:underline" href="/login">
              Masuk
            </a>
            <span className="text-white mx-2">|</span>
            <a className="hover:underline" href="/register">
              Daftar
            </a>
          </div>
          {/* For Companny Button */}
          <div className="hidden xl:block">
            <div className="relative">
              <button
                className="bg-yellow-400 text-black font-medium py-2 px-4 rounded-full shadow-md hover:bg-yellow-300 flex items-center space-x-2"
                onClick={toggleDropdown}
              >
                <span>Untuk Perusahaan</span>
                <ChevronDownIcon
                  className={`w-4 h-4 ml-1 transform transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-[167px] rounded-lg bg-white shadow-md z-10">
                  {/* Dropdown Items */}
                  <li className="flex h-[38px] items-center text-xs font-semibold text-neutral-800 border-b border-neutral-200 hover:bg-gray-100 rounded-t-lg">
                    <a
                      href="/register"
                      className="w-full h-full flex justify-center items-center px-4"
                    >
                      Daftar sebagai HR
                    </a>
                  </li>
                  <li className="flex h-[38px] items-center text-xs font-semibold text-neutral-800 border-b border-neutral-200 hover:bg-gray-100 rounded-b-lg">
                    <a
                      href="/login"
                      className="w-full h-full flex justify-center items-center px-4"
                    >
                      Masuk sebagai HR
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mt-4 bg-white text-black rounded-lg shadow-md p-4 xl:hidden">
          <ul className="space-y-2">
            <li className="block md:hidden">
              <button
                className="hover:text-purple-600 cursor-pointer flex items-center"
                onClick={toggleFiturKami}
              >
                Fitur Kami
                <ChevronDownIcon
                  className={`w-4 h-4 ml-1 transform transition-transform ${
                    isFiturKamiOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isFiturKamiOpen && (
                <ul className="mt-2 space-y-2 pl-4">
                  <li className="hover:text-purple-600 cursor-pointer">
                    <Link href="/loker">Loker</Link>
                  </li>
                  <li className="hover:text-purple-600 cursor-pointer">
                    <Link href="/perusahaan">Perusahaan</Link>
                  </li>
                  <li className="hover:text-purple-600 cursor-pointer">
                    <Link href="/cv-generator">CV Generator</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="hover:text-purple-600 cursor-pointer">
              <Link href="/about-us">Hubungi Kami</Link>
            </li>
          </ul>
          <div className="mt-6 flex flex-col space-y-3 text-center">
            <a
              className="bg-purple-100 text-purple-600 font-medium py-2 px-4 rounded-full"
              href="/login"
            >
              Masuk
            </a>
            <a
              className="bg-purple-600 text-white font-medium py-2 px-4 rounded-full"
              href="/register"
            >
              Daftar
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
