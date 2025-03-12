import { useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
interface IConfirm {
  message: string;
  setIsOpen: (IsOpen: boolean) => void;
  runFunction: () => void;
}

const ConfirmBox = ({ message, setIsOpen, runFunction }: IConfirm) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <h1 className="text-xl font-bold">Please Confirm</h1>
          <button
            onClick={closeModal}
            className="text-red-500 p-1 duration-150 ease-in-out font-bold text-xl rounded-full hover:bg-red-500 hover:text-white border border-red-500"
          >
            <XMarkIcon width={20} height={20} />
          </button>
        </div>

        {/* Confirmation Message Box */}
        <div className="mb-2">
          <p>{message}</p>
        </div>

        {/* Button Confirmation */}
        <div className="flex justify-between">
          <button
            onClick={closeModal}
            className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              runFunction();
              closeModal();
            }}
            className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-500 hover:text-black"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;
