import { useEffect, useRef, useState } from 'react';
import {
  BanknotesIcon,
  MapPinIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { IJobHomePage } from '@/lib/interface2';
import Image from 'next/image';
import { capitalizeFirstLetter, rupiahFormat } from '@/lib/stringFormat';
import ButtonCustom from './button/btn';
interface IConfirm {
  job: IJobHomePage;
  setIsOpen: (IsOpen: boolean) => void;
  runFunction: (expectedSalary: number) => void;
}

const ApplyModal = ({ job, setIsOpen, runFunction }: IConfirm) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expectedSalary, setExpectedSalary] = useState<string>('');

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    setIsModalOpen(true);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Pastikan tidak menyimpan angka 0 di awal
    if (value === '' || /^[1-9][0-9]*$/.test(value)) {
      setExpectedSalary(value);
    }
  };
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 modal-overlay ${
        isModalOpen ? 'open' : ''
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-slate-200 p-6 rounded-lg shadow-lg w-[400px] lg:w-[800px] max-h-[80vh] overflow-y-auto modal-content ${
          isModalOpen ? 'open' : ''
        }`}
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center pb-1 mb-2 border-b-2 border-slate-500">
          <h1 className="text-xl font-bold">Apply To Your Dream Job!</h1>

          <button
            onClick={closeModal}
            className="text-red-500 p-1 duration-150 ease-in-out font-bold text-xl rounded-full hover:bg-red-500 hover:text-white border border-red-500"
          >
            <XMarkIcon width={20} height={20} />
          </button>
        </div>

        <div className="flex flex-col gap-1 mb-2 px-2">
          <div className="flex flex-row gap-2">
            <div className="w-14 h-14 relative bg-blue-200">
              <Image
                src={job.company.account.avatar}
                fill
                alt="company_avt.jpg"
              />
            </div>
            <div className="w-full">
              <div className="flex flex-row justify-between">
                <h1 className="font-semibold text-lg">{job.title}</h1>
                <p className="flex flex-row gap-1 items-center text-slate-400 ">
                  Deadline : {new Date(job.deadline).toLocaleDateString()}
                </p>
              </div>
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

          <p>{job.description}</p>
        </div>

        <div className="my-2">
          <h1 className="font-semibold">Enter your expected salary (Rp) :</h1>
          <div className="w-full">
            <input
              type="number"
              className="w-full py-1 px-2"
              value={expectedSalary}
              onChange={handleSalaryChange}
              placeholder="Enter your expected salary"
            />
          </div>
        </div>

        {/* Button Confirmation */}
        <div className="flex justify-between">
          <button
            onClick={closeModal}
            className="bg-red-400 text-white px-4 py-1 rounded-md hover:bg-red-500 hover:text-black"
          >
            Cancel
          </button>
          <ButtonCustom
            btnName="Apply Now"
            onClick={() => runFunction(Number(expectedSalary) || 0)}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;
