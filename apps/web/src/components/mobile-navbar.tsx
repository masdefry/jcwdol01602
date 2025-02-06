import React from 'react';
import { useState } from 'react';

const MobileNavbar: React.FC = () => {
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
    <div>
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
                    Loker
                  </li>
                  <li className="hover:text-purple-600 cursor-pointer">
                    Mentoring
                  </li>
                  <li className="hover:text-purple-600 cursor-pointer">
                    Perusahaan
                  </li>
                  <li className="hover:text-purple-600 cursor-pointer">
                    Events
                  </li>
                  <li className="hover:text-purple-600 cursor-pointer">
                    CV Generator
                  </li>
                </ul>
              )}
            </li>
            <li className="hover:text-purple-600 cursor-pointer">
              Hubungi Kami
            </li>
          </ul>
          <div className="mt-6 flex flex-col space-y-3">
            <button className="bg-purple-100 text-purple-600 font-medium py-2 px-4 rounded-full">
              Masuk
            </button>
            <button className="bg-purple-600 text-white font-medium py-2 px-4 rounded-full">
              Daftar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
