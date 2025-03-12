import React, { useEffect, useState } from 'react';
import { AddBtn, DeleteBtn, EditBtn } from '../button/moreBtn';
import { ISubsData } from '@/lib/interface';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';

interface IUserEduList {
  subsData: ISubsData;
}

const UserEduList = ({ subsData }: IUserEduList) => {
  const [eduList, setEduList] = useState(subsData?.userEdu || []);
  const router = useRouter();
  useEffect(() => {
    if (subsData?.userEdu) {
      setEduList(subsData.userEdu);
    }
  }, [subsData]);

  const handleAddEdu = () => {
    router.push(`/user-data/new-edu`);
  };
  const handleEditEdu = (eduId: string) => {
    router.push(`/user-data/edit-edu/${eduId}`);
  };
  const handleDeleteEdu = async (eduId: string) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/education/delete/${eduId}`,
      );
      toast.success(data.message);
      setEduList((prevEduList) =>
        prevEduList.filter((edu) => edu.id !== eduId),
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
        <h1 className="text-white font-semibold text-xl">Education</h1>
        <AddBtn
          title="Education"
          runFunction={handleAddEdu}
          style="bg-white text-black hover:bg-yellow-400"
        />
      </div>
      {eduList.length > 0 ? (
        eduList.map((edu, idx) => (
          <div
            className="p-2 bg-white border-2 rounded-lg border-purple-500 flex flex-col gap-1"
            key={idx}
          >
            <div className="flex flex-row w-full justify-between items-center">
              <div className="flex gap-0 flex-col">
                <h1 className="font-semibold">{edu.school}</h1>
                <p>{edu.discipline}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <p className="font-semibold">
                  {new Date(edu.startDate).toLocaleDateString()} -{' '}
                  {edu.endDate
                    ? new Date(edu.endDate).toLocaleDateString()
                    : 'Now'}
                </p>
                <EditBtn runFunction={() => handleEditEdu(edu.id)} />
                <DeleteBtn runFunction={() => handleDeleteEdu(edu.id)} />
              </div>
            </div>
            {edu.description && (
              <div>
                <hr className="border border-purple-500 rounded-full" />
                <p>{edu.description}</p>
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

export default UserEduList;
