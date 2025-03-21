import { IJobHomePage } from '@/lib/interface2';
import React from 'react';
import ButtonCustom from '../button/btn';
import { BanknotesIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/solid';
import { capitalizeFirstLetter, rupiahFormat } from '@/lib/stringFormat';
import Image from 'next/image';

const HomeJobCard = ({
  job,
  onApply,
}: {
  job: IJobHomePage;
  onApply: (jobId: string) => void;
}) => {
  return (
    <div className="border-2 bg-white p-2 rounded-lg shadow-md mx-1 my-2">
      <div className="flex flex-row gap-2">
        <div className="w-14 h-14 relative bg-blue-200">
          <Image src={job.company.account.avatar} fill alt="company_avt.jpg" />
        </div>
        <div>
          <h1 className="font-semibold text-lg">{job.title}</h1>

          <p>{job.company.account.name}</p>
        </div>
      </div>
      <p className="text-slate-400 flex flex-row gap-1 items-center">
        <TagIcon width={20} height={20} />
        {capitalizeFirstLetter(job.category)}
      </p>
      <p className="flex flex-row gap-1 items-center">
        <MapPinIcon width={20} height={20} /> {job.location}
      </p>
      <p className="flex flex-row gap-1 items-center">
        <BanknotesIcon width={20} height={20} />±
        {rupiahFormat(Number(job.salaryRange))}
      </p>
      <div className="w-full flex justify-end">
        <ButtonCustom btnName="Apply Now" onClick={() => onApply(job.id)} />
      </div>
    </div>
  );
};

export default HomeJobCard;
