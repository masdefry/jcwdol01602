import React, { useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ModalDetailProps {
    data: Record<string, any>; // Can accept any object
    title?: string; // Optional for modal's title
    setIsOpen: (isOpen: boolean) => void;
    additionalActions?: React.ReactNode; // Add this prop
}

export default function ModalDetail({
    data,
    title,
    setIsOpen,
    additionalActions, // Destructure the prop
}: ModalDetailProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpenState] = useState(false);

    // function to close modal when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    // function to close modal with anmiation
    const closeModal = () => {
        setIsOpenState(false);
        setTimeout(() => setIsOpen(false), 300);
    };

    // Add event listener when the components is mounted
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        setIsOpenState(true);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    return (
        <div
            className={`fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 modal-overlay ${
                isOpen ? 'open' : ''
            }`}
        >
            <div
                ref={modalRef}
                className={`bg-slate-200 p-6 rounded-lg shadow-lg w-[400px] lg:w-[800px] max-h-[80vh] overflow-y-auto modal-content ${
                    isOpen ? 'open' : ''
                }`}
            >
                {/* Header Modal */}
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">{title || 'Detail Information'}</h1>
                    <button
                        onClick={closeModal}
                        className="text-red-500 bg-white p-2 duration-150 ease-in-out font-bold text-xl rounded-full hover:bg-red-500 hover:text-white"
                    >
                        <XMarkIcon className="w-4 h-4 font-bold" />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="mt-4 space-y-2">
                    {Object.entries(data).map(([key, value]) => {
                        if (typeof value === 'string') {
                            return (
                                <div key={key}>
                                    <h2 className="text-lg font-semibold capitalize">{key} :</h2>
                                    {value === '' || value === null ? (
                                        <p className="text-gray-700 p-2 bg-white border rounded-lg">
                                            -
                                        </p>
                                    ) : (
                                        <p className="text-gray-700 p-2 bg-white border rounded-lg">
                                            {value}
                                        </p>
                                    )}
                                </div>
                            );
                        }

                        if (Array.isArray(value)) {
                            return (
                                <div key={key}>
                                    <h2 className="text-lg font-semibold capitalize">{key}:</h2>
                                    <div className="flex flex-wrap gap-2 p-2 bg-white rounded-lg justify-center">
                                        {value.every((v) => typeof v === 'object' && v.url) ? (
                                            value.map((img) => (
                                                <img
                                                    key={img.id || img.url}
                                                    src={img.url}
                                                    alt={img.id || 'Image'}
                                                    className="w-16 h-16 object-cover rounded-md border-gray-600 border"
                                                />
                                            ))
                                        ) : (
                                            <ul className="list-disc ml-4">
                                                {value.map((item, idx) => (
                                                    <li key={idx} className="text-gray-700">
                                                        {String(item)}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            );
                        }

                        if (typeof value === 'object' && value !== null) {
                            return (
                                <div key={key}>
                                    <h2 className="text-lg font-semibold capitalize">{key} :</h2>
                                    {Object.entries(value).map(([subKey, subValue]) => (
                                        <p
                                            key={subKey}
                                            className="text-gray-700 p-2 border rounded-lg bg-white"
                                        >
                                            <strong>{subKey}:</strong> {String(subValue)}
                                        </p>
                                    ))}
                                </div>
                            );
                        }

                        return (
                            <div key={key}>
                                <h2 className="text-lg font-semibold capitalize">{key} :</h2>
                                <p className="text-gray-700 p-2 border bg-white rounded-lg">
                                    {String(value)}
                                </p>
                            </div>
                        );
                    })}
                </div>
                {/* Footer Modal */}
                {additionalActions && (
                    <div className="mt-4 flex justify-end">
                        {additionalActions}
                    </div>
                )}
            </div>
        </div>
    );
}
