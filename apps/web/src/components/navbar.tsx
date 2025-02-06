'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import HamburgerIcon from './hamburger';
import DownArrow from './down-arrow';

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
    <nav className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white py-3 px-6 fixed w-full">
      <div className="flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold">Dream Job!</h1>
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
          <HamburgerIcon />
        </button>

        {/* Desktop Buttons */}
        <div className="flex items-center space-x-4">
          <div className="hidden xl:block space-x-4">
            <a className="hover:underline" href="/login">
              Masuk
            </a>
            <a className="bg-white"> </a>
            <a className="hover:underline" href="/register">
              Daftar
            </a>
          </div>

          {/* Highlighted Button */}
          <div className="hidden xl:block">
            <div className="relative">
              <button
                className="bg-yellow-400 text-black font-medium py-2 px-4 rounded-full shadow-md hover:bg-yellow-300 flex items-center space-x-2"
                onClick={toggleDropdown}
              >
                <span>Untuk Perusahaan</span>
                <DownArrow />
              </button>
              {isDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-[167px] rounded-lg bg-white shadow-md z-10">
                  <li className="flex h-[38px] items-center px-4 text-xs font-semibold text-neutral-800 border-b border-neutral-200 hover:bg-gray-100 rounded-lg">
                    <a
                      href="/register"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Daftar sebagai HR
                    </a>
                  </li>
                  <li className="flex h-[38px] items-center px-4 text-xs font-semibold text-neutral-800 border-b border-neutral-200 hover:bg-gray-100 rounded-lg">
                    <a href="/login" target="_blank" rel="noopener noreferrer">
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
          <ul className="space-y-4">
            <li>
              <button
                className="hover:text-purple-600 cursor-pointer flex items-center"
                onClick={toggleFiturKami}
              >
                Fitur Kami
                <svg
                  className={`w-4 h-4 ml-1 transform transition-transform ${
                    isFiturKamiOpen ? 'rotate-180' : ''
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
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
            <li className="hover:text-purple-600 cursor-pointer"> <Link href="/about-us">Hubungi Kami</Link></li>
          </ul>
          <div className="mt-6 flex flex-col space-y-3 text-center">
            <a className="bg-purple-100 text-purple-600 font-medium py-2 px-4 rounded-full" href="/login">
              Masuk </a>
            <a className="bg-purple-600 text-white font-medium py-2 px-4 rounded-full" href="/register">
              Daftar  </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
