import Link from 'next/link';

const Footer = (): JSX.Element => {
  return (
    <footer className="mt-auto flex w-full flex-col items-center justify-center border-t border-gray-200 bg-neutral-5">
      <div className="flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 lg:flex-row lg:items-stretch lg:gap-4 lg:p-8 lg:pb-9">
        {/* Logo and Description Section */}
        <div className="flex w-full flex-col gap-[13px]">
          <Link legacyBehavior href="/" className="w-fit">
            <a className="text-purple-600 text-2xl font-bold">Dream Job!</a>
          </Link>
          <div className="flex flex-col gap-2.5">
            <h2 className="text-[11px] font-normal leading-[1.3] text-zinc-900">
              Temukan Pekerjaan Idaman & Kembangkan Potensi Anda
            </h2>
            <h3 className="text-[11px] font-normal leading-[1.3] text-zinc-900">
              Dream Job! adalah portal karir terdepan dengan ribuan lowongan
              kerja berkualitas dari perusahaan ternama. Dapatkan peluang karir
              terbaik dan tingkatkan CV Anda bersama kami.
            </h3>
            <span className="text-[11px] font-normal leading-[1.3] text-zinc-900">
              Jadikan Dream Job! sebagai partner dalam perjalanan karir Anda.
              Dengan lowongan kerja terpercaya dan CV tools praktis kesuksesan
              semakin mudah diraih.
            </span>
          </div>
        </div>
        {/* Links Sections */}
        <div className="flex w-full flex-row lg:w-fit">
          {/* Loker Links */}
          <div className="flex w-1/2 flex-col gap-3 pr-4 lg:w-[132px] lg:gap-6 lg:pr-0">
            <h3 className="text-xs font-bold leading-none text-tertiary-violet-90">
              Loker
            </h3>
            <div className="flex flex-col items-start justify-start gap-2.5 lg:gap-3">
              <Link
                href="/loker/lokasi"
                className="text-[11px] font-normal leading-[14.30px] text-zinc-900"
              >
                Loker berdasarkan Lokasi
              </Link>
              <Link
                href="/loker/perusahaan"
                className="text-[11px] font-normal leading-[14.30px] text-zinc-900"
              >
                Loker berdasarkan Perusahaan
              </Link>
            </div>
          </div>
          {/* Perusahaan Links */}
          <div className="flex w-1/2 flex-col gap-3 lg:w-[160px] lg:gap-6">
            <h3 className="text-xs font-bold leading-none text-tertiary-violet-90">
              Untuk Perusahaan
            </h3>
            <div className="flex flex-col items-start justify-start gap-2.5 lg:gap-3">
              <Link
                href="/pasang-loker-gratis"
                className="text-[11px] font-normal leading-[14.30px] text-zinc-900"
              >
               Job Portal
              </Link>
              <Link
                href="/dashboard-hr"
                className="text-[11px] font-normal leading-[14.30px] text-zinc-900"
              >
                Dashboard HR
              </Link>
            </div>
          </div>
        </div>
        {/* Contact and Social Media Section */}
        <div className="flex w-full flex-row lg:w-fit lg:flex-row-reverse">
          <div className="flex w-1/2 flex-col gap-3 pr-4 lg:w-[300px] lg:gap-6 lg:pr-0">
            <h3 className="text-xs font-bold leading-none text-tertiary-violet-90">
              Hubungi Kami
            </h3>
            <div className="flex flex-col items-start justify-start gap-2.5 lg:gap-3">
              <p className="text-[11px] font-normal leading-[1.3] text-zinc-900">
                Menara Duta Lt. 7, Jl. H. R. Rasuna Said No. 5, Setiabudi,
                Jakarta Selatan 12910
              </p>
              <p className="text-[11px] font-normal leading-[1.3] text-zinc-900">
                160 Robinson Road #20-03 Singapore, 068914
              </p>
            </div>
          </div>
          {/* Tentang Dream Jobs Links */}
          <div className="flex w-1/2 flex-col gap-3 lg:gap-6 lg:pr-2 xl:max-w-[143px]">
            <h3 className="text-xs font-bold leading-none text-tertiary-violet-90">
              Tentang Dream Job
            </h3>
            <div className="flex flex-col items-start justify-start gap-2.5 lg:gap-3">
              <Link
                href="/about"
                className="text-[11px] font-normal leading-[14.30px] text-zinc-900"
              >
                Cerita Kami
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright Section */}
      <div className="flex h-10 w-full items-center border-t border-neutral-20 bg-neutral-10 px-4 text-[11px] font-medium leading-none text-zinc-900 lg:h-12 lg:px-8 lg:text-xs">
        © 2025 Dream Job!. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
