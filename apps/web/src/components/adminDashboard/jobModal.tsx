'use client';
import React from 'react';
import ModalCreate from '@/components/table/modalCreate';
import { Job, Categories, Locations } from '@/types/job';
import * as Yup from 'yup';

interface JobModalProps {
    editJob: Job | null;
    addModalOpen: boolean;
    setAddModalOpen: (open: boolean) => void;
    handleNewJob: (values: Omit<Job, 'id'>) => Promise<void>;
    categories: Categories[];
    locations: Locations[];
}

const JobModal: React.FC<JobModalProps> = ({
    editJob,
    addModalOpen,
    setAddModalOpen,
    handleNewJob,
    categories,
    locations,
}) => {

    const categoryOptions = categories.map((cat) => ({
        id: cat,
        name: cat,
    }));

    const locationOptions = locations.map((loc) => ({
        id: loc,
        name: loc,
    }));

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        deadline: Yup.string().required('Deadline is required'),
        category: Yup.string().required('Category is required'),
        location: Yup.string().required('Location is required'),
        salaryRange: Yup.string(),
        companyId: Yup.string(),
        isPublished: Yup.boolean(),
        createdAt: Yup.string(),
        updatedAt: Yup.string(),
        applicants: Yup.array(),
        PreSelectionTest: Yup.array()
    });

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
                            category: editJob.category,
                            location: editJob.location,
                        }
                        : {
                            title: '',
                            description: '',
                            category: categories[0] || Categories.IT,
                            location: locations[0] || Locations.Jakarta,
                            salaryRange: '',
                            deadline: '',
                            companyId: '',
                            isPublished: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            applicants: [],
                            PreSelectionTest: []
                        }
                }
                onSubmit={handleNewJob}
                isOpen={addModalOpen}
                setIsOpen={setAddModalOpen}
                disabled={false}
                fields={[
                    { name: 'title', label: 'Title', type: 'text' as const },
                    { name: 'description', label: 'Description', type: 'textarea' as const },
                    {
                        name: 'category',
                        label: 'Category',
                        type: 'select' as const,
                        options: categoryOptions,
                    },
                    {
                        name: 'location',
                        label: 'Location',
                        type: 'select' as const,
                        options: locationOptions,
                    },
                    { name: 'salaryRange', label: 'Salary Range', type: 'text' as const },
                    { name: 'deadline', label: 'Deadline', type: 'date' as const },
                ]}
                validationSchema={validationSchema}
            />
        )
    );
};

export default JobModal;
