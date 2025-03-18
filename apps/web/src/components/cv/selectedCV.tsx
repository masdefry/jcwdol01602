import { ISubsData } from '@/lib/interface';
import React, { useRef, useState } from 'react';
import ButtonCustom from '../button/btn';
import toast from 'react-hot-toast';
import { ICvData } from '@/lib/interface2';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import PreviewCV from './previewCV';

interface ISelectedCV {
  subsData: ISubsData | null;
  refreshCVs: () => void;
}

const SelectedCV: React.FC<ISelectedCV> = ({ subsData, refreshCVs }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewSelectedCV = () => {
    setIsModalOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, DOC, and DOCX files are allowed!');
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 2MB!');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadCV = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first!');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const { data } = await axiosInstance.post('/api/cv/upload', formData);
      toast.success(data.message);
      setTimeout(() => refreshCVs(), 1500);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-2 bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-lg shadow-md flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <h1 className="text-white text-xl font-semibold text-nowrap">
          Selected CV:
        </h1>

        {subsData?.selectedCv ? (
          <div className="p-2 bg-white rounded-xl w-full flex items-center justify-between gap-2">
            <p>{subsData.selectedCv.id}</p>
            <ButtonCustom
              btnName="Preview CV"
              onClick={() => {
                if (subsData.selectedCv) {
                  previewSelectedCV();
                }
              }}
            />
          </div>
        ) : (
          <p className="text-white flex items-center font-semibold">-</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-white font-semibold text-lg text-nowrap">
          Upload CV :
        </h1>
        <div className="bg-white p-2 w-full flex items-center justify-between rounded-xl">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <ButtonCustom
            btnName={loading ? 'Uploading...' : 'Upload CV'}
            onClick={handleUploadCV}
            disabled={loading}
          />
        </div>
      </div>
      {isModalOpen && subsData?.selectedCv?.cvPath && (
        <PreviewCV
          cvPath={subsData.selectedCv?.cvPath}
          setIsOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default SelectedCV;
