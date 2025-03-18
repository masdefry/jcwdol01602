'use client';
import ButtonCustom from '@/components/button/btn';
import ConfirmBox from '@/components/confirmBox';
import axiosInstance from '@/lib/axios';
import { ISubsCtg, ISubsData } from '@/lib/interface';
import { capitalizeFirstLetter, rupiahFormat } from '@/lib/stringFormat';
import useAuthStore from '@/stores/authStores';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const confirmMessage = `You have an active subscription plan, if you choose to continue, your previous subscription plan will be gone.`;

const Plan = () => {
  const { account, clearAuth } = useAuthStore();
  const [subsCtg, setSubsCtg] = useState<ISubsCtg[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [subsData, setSubsData] = useState<ISubsData>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedSubsCtgId, setSelectedSubsCtgId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const getSubsCtg = async () => {
      try {
        const { data } = await axiosInstance.get(
          '/api/subscription/categories',
        );
        setSubsCtg(data.subsCtg);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getSubsCtg();
  }, []);

  useEffect(() => {
    if (!account) return;
    const getUserSubsData = async () => {
      try {
        const { data } = await axiosInstance.get('/api/subscription/my-data');
        setSubsData(data.subsData);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      }
    };
    getUserSubsData();
  }, [account]);

  const updateSubsData = async (subsCtgId: string) => {
    try {
      const { data } = await axiosInstance.patch(
        `/api/subscription/update/${subsCtgId}`,
      );
      toast.success(data.message);
      if (subsCtgId !== 'sc250206-01') {
        setTimeout(
          () =>
            router.push(
              `/choose-plan/confirm-payment/${data.subsData.payment.id}`,
            ),
          1500,
        );
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  const handleChoosePlanBtn = async (subsCtgId: string) => {
    if (!account) {
      toast.error('You need to login first!');
      // setTimeout(() => router.push('/login'), 1500);
      return;
    }

    if (subsData?.isSubActive) {
      setSelectedSubsCtgId(subsCtgId);
      setIsConfirmOpen(true);
      return;
    } else {
      await updateSubsData(subsCtgId);
    }
  };

  const confirmSubscription = async () => {
    if (selectedSubsCtgId) {
      await updateSubsData(selectedSubsCtgId);
    }
  };
  return (
    <>
      <div className=" flex flex-col gap-2 justify-center items-center pt-2 pb-4">
        <h1 className="text-2xl font-bold">Choose Your Subscription Plan!</h1>
        <p>Upgrade your account and increase your chances of getting a job!</p>
        <div>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : subsCtg && subsCtg.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
              {subsCtg.map((category) => (
                <div
                  key={category.id}
                  className="bg-gradient-to-b from-fuchsia-600 to-purple-600 shadow-md rounded-lg p-6 flex flex-col justify-between min-h-[250px]"
                >
                  <div>
                    <div className="flex flex-col justify-center items-center gap-2">
                      <h2 className="text-xl font-semibold text-white">
                        {capitalizeFirstLetter(category.name)}
                      </h2>
                      <p className="text-lg font-bold text-yellow-200">
                        {rupiahFormat(category.price)}/month
                      </p>
                    </div>
                    <hr className="my-3 border-gray-300" />
                    {/* Fitur tambahan berdasarkan kategori */}
                    <ul className="text-gray-200 text-sm my-3 list-disc pl-5">
                      {category.name === 'free' && (
                        <>
                          <li>Default plan after registration</li>
                          <li>No CV Generator</li>
                          <li>No Skill Assesstment</li>
                          <li>No Priority when applying jobs</li>
                        </>
                      )}
                      {category.cvGenerator && (
                        <li>CV generator to help you create your CV</li>
                      )}
                      {category.skillAssessment &&
                        category.name.toLowerCase() === 'standard' && (
                          <li>Two times assessment skill</li>
                        )}
                      {category.skillAssessment &&
                        category.name.toLowerCase() === 'professional' && (
                          <li>Unlimited skill assessments</li>
                        )}
                      {category.priority && (
                        <li>Prioritized when applying for jobs</li>
                      )}
                    </ul>
                  </div>
                  <div className="flex justify-center">
                    <ButtonCustom
                      btnName="Choose plan"
                      onClick={() => handleChoosePlanBtn(category.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              No subscription categories available.
            </p>
          )}
        </div>
      </div>
      {isConfirmOpen && selectedSubsCtgId && (
        <ConfirmBox
          message={confirmMessage}
          setIsOpen={setIsConfirmOpen}
          runFunction={() => confirmSubscription()}
        />
      )}
    </>
  );
};

export default Plan;
