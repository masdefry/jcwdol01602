'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/solid';
import ButtonCustom from '@/components/button/btn';

interface ImageUploaderProps {
  title: string;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (image: File | null) => void;
}

const ImageUploader = ({ title, setIsOpen, onSubmit }: ImageUploaderProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node))
      closeModal();
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    setIsModalOpen(true);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setImagePreview(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    onSubmit(selectedImage);
    closeModal();
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 modal-overlay ${isModalOpen ? 'open' : ''} `}
    >
      <div
        ref={modalRef}
        className="bg-slate-200 p-6 rounded-lg shadow-lg w-[400px] lg:w-[600px] max-h-[80vh] overflow-y-auto transition-transform transform scale-95 opacity-0 animate-fadeIn"
      >
        <div className="flex justify-between items-center pb-2 mb-4 border-b-2 border-gray-300">
          <h1 className="text-xl font-bold">Upload Payment Proof</h1>
          <button
            onClick={closeModal}
            className="text-red-500 p-2 ease-in-out duration-150 bg-white rounded-full hover:bg-red-500 hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex mb-4">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileInput}
            className="hidden"
            ref={fileInputRef}
          />
          <ButtonCustom
            btnName="Upload Image"
            onClick={() => fileInputRef.current?.click()}
          />
        </div>
        <div className="mb-4 flex flex-wrap min-h-40 justify-center items-center gap-4 bg-white p-4 rounded-lg">
          {imagePreview && (
            <div className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-300">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
        <ButtonCustom
          btnName="Submit Image"
          onClick={handleSubmit}
          disabled={!selectedImage}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
