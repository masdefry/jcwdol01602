'use client';
import useUserSubsData from '@/hooks/userSubsData';
import useAuthStore from '@/stores/authStores';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { capitalizeFirstLetter } from '@/lib/stringFormat';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import WorkList from '@/components/userProfile/workList';
import { IUserEdu } from '@/lib/interface';
import { AddBtn, DeleteBtn, EditBtn } from '@/components/button/moreBtn';
import UserEduList from '@/components/userProfile/userEduList';

const Profile = () => {
  const { account } = useAuthStore();
  const { subsData, loading, error } = useUserSubsData();
  const router = useRouter();

  return (
    <div className="p-2">
      {account && subsData && (
        <>
          <div className="flex flex-row items-center px-8 py-2 gap-4 bg-gradient-to-l from-fuchsia-500 to-purple-500 rounded-lg">
            <div className="w-24 h-24 relative">
              <Image
                src={account.avatar}
                alt="account-avatar"
                fill
                className="object-contain p-1 rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{account.name}</h1>
              <p className="flex gap-1 items-center">
                <EnvelopeIcon width={18} height={18} />
                {account.email}
              </p>
              <p className="flex gap-1 items-center">
                <PhoneIcon width={18} height={18} />
                {subsData?.userProfile.phoneNumber ?? 'No Phone Number'}
              </p>
              <p className="flex gap-1 items-center">
                <MapPinIcon width={18} height={18} />
                {subsData?.userProfile.address ?? 'No Phone Number'}
              </p>
            </div>
          </div>
          {/* Personal Data */}
          <div className="my-2 flex flex-col gap-2 border-2 p-2 rounded-lg border-purple-500">
            <h1 className="font-semibold text-lg">Personal Data</h1>
            <div className="flex flex-row gap-1 p-2 border-2 rounded-lg items-center">
              <p className="basis-1/6 font-semibold">Gender</p>
              <p>:</p>
              <p>{capitalizeFirstLetter(subsData.userProfile.gender)}</p>
            </div>
            <div className="flex flex-row gap-1 p-2 border-2 rounded-lg items-center">
              <p className="basis-1/6 font-semibold">Place of Birth</p>
              <p>:</p>
              <p>{subsData.userProfile.pob}</p>
            </div>
            <div className="flex flex-row gap-1 p-2 border-2 rounded-lg items-center">
              <p className="basis-1/6 font-semibold">Date of Birth</p>
              <p>:</p>
              <p>
                {subsData?.userProfile?.dob
                  ? new Date(subsData.userProfile.dob).toLocaleDateString(
                      'en-GB',
                    )
                  : '-'}
              </p>
            </div>
          </div>

          <WorkList subsData={subsData} />

          <UserEduList subsData={subsData} />
        </>
      )}
    </div>
  );
};

export default Profile;
