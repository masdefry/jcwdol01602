import Link from 'next/link';
import {
  footerCompLink,
  footerContact,
  footerData,
  footerMenu,
} from './footer/footerData';
import Logo from './logo';

const Footer = (): JSX.Element => {
  return (
    <footer className="mt-auto flex w-full flex-col items-center justify-center border-t border-gray-200 bg-neutral-5">
      <div className="flex w-full max-w-[1440px] gap-6 px-4 py-6 flex-row lg:items-stretch lg:gap-4 lg:p-8 lg:pb-9">
        {/* Logo and Description Section */}
        <div className="flex w-full flex-col gap-[13px]">
          <Logo />
          <div className="flex flex-col gap-2.5">
            {footerData.map((data, idx) => (
              <p
                key={idx}
                className="text-[11px] font-normal leading-[1.3] text-zinc-900"
              >
                {data}
              </p>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {/* For Company */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-sm">{footerMenu.company}</h2>
            <div className=" flex flex-col gap-2">
              {footerCompLink.map((link, idx) => (
                <Link
                  href={link.href}
                  key={idx}
                  className="text-xs text-gray-900 hover:text-purple-600 text-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {/* For Company */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-sm">{footerMenu.contact}</h2>
            <div className=" flex flex-col gap-2">
              {footerContact.map((data, idx) => (
                <p className="text-xs text-gray-900" key={idx}>
                  {data}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Copyright Section */}
      <div className="flex h-10 w-full items-center border-t border-neutral-20 bg-neutral-10 px-4 text-[11px] font-medium leading-none text-zinc-900 lg:h-12 lg:px-8 lg:text-xs">
        © 2025 Dream Job. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
