'use client';
import ButtonCustom from '@/components/button/btn';
import { DeleteBtn } from '@/components/button/moreBtn';
import PreviewCV from '@/components/cv/previewCV';
import SelectedCV from '@/components/cv/selectedCV';
import { Heading } from '@/components/heading';
import useUserSubsData from '@/hooks/userSubsData';
import axiosInstance from '@/lib/axios';
import { ICvData } from '@/lib/interface2';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CV = () => {
  const { subsData, refreshSubsData } = useUserSubsData();
  const [cvDatas, setCvDatas] = useState<ICvData[]>([]);
  const [previewCV, setPreviewCv] = useState<ICvData>();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const getAllUserCv = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/cv/my-datas`);
      setCvDatas(data.cvDatas);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    getAllUserCv();
  }, []);

  const handlePreviewCv = (cvData: ICvData) => {
    setIsPreviewOpen(true);
    setPreviewCv(cvData);
  };

  const handleSelectCV = async (cvId: string) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.patch(`/api/cv/select/${cvId}`);
      toast.success(data.message);
      setTimeout(() => refreshSubsData(), 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.delete(`/api/cv/delete/${cvId}`);
      toast.success(data.message);

      setTimeout(() => {
        setCvDatas((prev) => prev.filter((cv) => cv.id !== cvId));
        refreshSubsData();
      }, 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <Heading
        title="My Curriculum Vitae Data"
        description="Configure your cv here"
      />
      {/* Selected CV */}
      <SelectedCV subsData={subsData} refreshCVs={getAllUserCv} />

      {/* cvDatas */}
      <div>
        {!cvDatas ? (
          <div className="bg-white rounded-lg shadow-md border-2 my-2">
            <p>No Data</p>
          </div>
        ) : (
          cvDatas.map((cvData, idx) => (
            <div
              className="p-2 bg-white rounded-lg shadow-md border-2 my-2 flex justify-between items-center"
              key={idx}
            >
              <div>
                <h1>{cvData.id}</h1>
                <p>
                  Uploaded at :{' '}
                  {new Date(cvData.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <ButtonCustom
                  btnName="Preview CV"
                  onClick={() => handlePreviewCv(cvData)}
                />
                <ButtonCustom
                  btnName="Select CV"
                  onClick={() => handleSelectCV(cvData.id)}
                  disabled={isLoading}
                />
                <DeleteBtn
                  runFunction={() => handleDeleteCV(cvData.id)}
                  disabled={isLoading}
                />
              </div>
            </div>
          ))
        )}
        {isPreviewOpen && previewCV && (
          <PreviewCV cvPath={previewCV.cvPath} setIsOpen={setIsPreviewOpen} />
        )}
      </div>
    </div>
  );
};

export default CV;
