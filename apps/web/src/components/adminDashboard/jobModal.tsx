// components/adminDashboard/JobModal.tsx
'use client';
import React from 'react';
import ModalCreate from '@/components/table/modalCreate';
import { Job } from '@/types/job';

interface JobModalProps {
    editJob: Job | null;
    addModalOpen: boolean;
    setAddModalOpen: (open: boolean) => void;
    handleNewJob: (values: Omit<Job, 'id'>) => Promise<void>;
}

const JobModal: React.FC<JobModalProps> = ({ editJob, addModalOpen, setAddModalOpen, handleNewJob }) => {
    return (
        addModalOpen && (
            <ModalCreate
                title={editJob ? 'Edit Job' : 'Create New Job'}
                initialValues={
                    editJob
                        ? {
                            ...editJob,
                            deadline: editJob.deadline ? editJob.deadline.split('T')[0] : '',
                            createdAt: editJob.createdAt,
                        }
                        : {
                            title: '',
                            description: '',
                            category: '',
                            location: '',
                            salaryRange: '',
                            deadline: '',
                            companyId: '',
                            isPublished: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            applicants: [],
                        }
                }
                onSubmit={handleNewJob}
                isOpen={addModalOpen}
                setIsOpen={setAddModalOpen}
                disabled={false}
                fields={[
                    { name: 'title', label: 'Title', type: 'text' as const },
                    { name: 'description', label: 'Description', type: 'textarea' as const },
                    { name: 'category', label: 'Category', type: 'text' as const },
                    { name: 'location', label: 'Location', type: 'text' as const },
                    { name: 'salaryRange', label: 'Salary Range', type: 'text' as const },
                    { name: 'deadline', label: 'Deadline', type: 'date' as const },
                ]}
                validationSchema={undefined}
            />
        )
    );
};

export default JobModal;
