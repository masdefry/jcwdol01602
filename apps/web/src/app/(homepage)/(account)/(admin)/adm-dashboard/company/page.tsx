'use client';
import ButtonCustom from '@/components/button/btn';
import { DetailBtn } from '@/components/button/moreBtn';
import useCompanyData from '@/hooks/useCompanyData';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const Company = () => {
  const { companies } = useCompanyData();
  const router = useRouter();
  const handleCompanyPage = (companyId: string) => {
    router.push(`/company/${companyId}`);
  };
  return (
    <div className="p-4">
      <div className="text-white bg-gradient-to-br from-purple-500 to-fuchsia-500 p-4 rounded-lg shadow-md">
        <h1 className="font-bold text-2xl">
          Find Your Job Opportunity from The Companies!
        </h1>
      </div>
      {!companies ? (
        <div>Still under maintenance</div>
      ) : (
        companies.map((company) => (
          <div
            key={company.Company.id}
            className="p-2 rounded-lg bg-slate-100 my-2 shadow-md"
          >
            <div className="flex gap-2">
              <div className="relative bg-blue-400 border-2 border-black w-32 h-32 overflow-clip">
                <Image
                  src={company.avatar}
                  alt={`${company.name}' avatar`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold">{company.name}</h1>
                <p className="text-slate-400">{company.email}</p>
                <p>{company.Company.phone}</p>
                <p>{company.Company.address ? company.Company.address : ''}</p>
                <p>{company.Company.website ? company.Company.website : ''}</p>
              </div>
            </div>
            <div className="flex w-full my-2 justify-end">
              <ButtonCustom
                btnName={`Edit company's page`}
                onClick={() => handleCompanyPage(company.Company.id)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Company;
