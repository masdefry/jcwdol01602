import React, { useEffect, useState } from 'react';
import { AddBtn, DeleteBtn, EditBtn } from '../button/moreBtn';
import { useRouter } from 'next/navigation';
import { ISubsData } from '@/lib/interface';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';

interface IWorkList {
  subsData: ISubsData;
}
const WorkList = ({ subsData }: IWorkList) => {
  const router = useRouter();
  const [workList, setWorkList] = useState(subsData?.worker || []);

  useEffect(() => {
    if (subsData?.worker) {
      setWorkList(subsData.worker);
    }
  }, [subsData]);

  const handleAddWork = () => {
    router.push(`/user-data/new-work`);
  };

  const handleEditWork = (workerId: string) => {
    router.push(`/user-data/edit-work/${workerId}`);
    setWorkList((prevWorkList) =>
      prevWorkList.filter((worker) => worker.id !== workerId),
    );
  };

  const handleDeleteWork = async (workerId: string) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/worker/delete/${workerId}`,
      );
      toast.success(data.message);
      setTimeout(
        () =>
          setWorkList((prevWorkList) =>
            prevWorkList.filter((work) => work.id !== workerId),
          ),
        1000,
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    }
  };
  return (
    <div className="my-4 flex flex-col gap-2">
      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-lg">
        <h1 className="text-white font-semibold text-xl">Work Experience</h1>
        <AddBtn
          title="Work"
          runFunction={handleAddWork}
          style="bg-white text-black hover:bg-yellow-400"
        />
      </div>
      {workList.length > 0 ? (
        workList.map((work, idx) => (
          <div
            className="p-2 bg-white border-2 rounded-lg border-purple-500 flex flex-col gap-1"
            key={idx}
          >
            <div className="flex flex-row w-full justify-between items-center">
              <div className="flex gap-0 flex-col">
                <h1 className="font-semibold">{work.companyName}</h1>
                <p>{work.position}</p>
                {work.isVerified ? (
                  <p className="text-green-400">Verified by company</p>
                ) : (
                  <p className="text-slate-400">Not verified by company</p>
                )}
              </div>
              <div className="flex flex-row gap-2 items-center">
                <p className="font-semibold">
                  {new Date(work.startDate).toLocaleDateString()} -{' '}
                  {work.endDate
                    ? new Date(work.endDate).toLocaleDateString()
                    : 'Now'}
                </p>
                <EditBtn runFunction={() => handleEditWork(work.id)} />
                <DeleteBtn runFunction={() => handleDeleteWork(work.id)} />
              </div>
            </div>
            {work.description && (
              <div>
                <hr className="border border-purple-500 rounded-full" />
                <p>{work.description}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="p-2 bg-white border-2 rounded-lg border-purple-500 flex flex-col gap-1">
          No Data
        </div>
      )}
    </div>
  );
};

export default WorkList;
