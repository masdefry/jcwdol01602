'use client';
import React, { useState } from 'react';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import NewForm from '@/components/newForm';
import { useRouter } from 'next/navigation';

const CreatePreSelectionTest: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [testId, setTestId] = useState<string | null>(null); // To store the created test ID

    const initialValues = {
        jobId: '',
        isActive: false,
        questions: Array.from({ length: 25 }, () => ({ // Adjust to 25 questions
            question: '',
            image: null,
            option_a: '',
            option_b: '',
            option_c: '',
            option_d: '',
            answer: '',
        })),
    };

    const fields: {
        name: string;
        label: string;
        type: 'text' | 'select' | 'checkbox' | 'textarea' | 'file';
    }[] = [
        { name: 'jobId', label: 'Job ID', type: 'text' },
        { name: 'isActive', label: 'Activate Test', type: 'checkbox' },
        ...Array.from({ length: 25 }, (_, index) => [ // Adjust to 25 questions
            { name: `questions[${index}].question`, label: `Question ${index + 1}`, type: 'text' as const },
            { name: `questions[${index}].image`, label: `Image URL (optional)`, type: 'file' as const },
            { name: `questions[${index}].option_a`, label: `Option A`, type: 'text' as const },
            { name: `questions[${index}].option_b`, label: `Option B`, type: 'text' as const },
            { name: `questions[${index}].option_c`, label: `Option C`, type: 'text' as const },
            { name: `questions[${index}].option_d`, label: `Option D`, type: 'text' as const },
            { name: `questions[${index}].answer`, label: `Correct Answer (a, b, c, or d)`, type: 'text' as const },
        ]).flat(),
    ];

    const onSubmit = async (values: typeof initialValues) => {
        setLoading(true);
        try {
            // 1. Create the PreSelectionTest
            const testResponse = await axiosInstance.post('/api/preselectiontest/create', {
                jobId: values.jobId,
            });

            const newTestId = testResponse.data.test.id;
            setTestId(newTestId);

            // 2. Format and create the questions
            const formattedQuestions = values.questions.map((q) => ({
                question: q.question,
                option_a: q.option_a,
                option_b: q.option_b,
                option_c: q.option_c,
                option_d: q.option_d,
                answer: q.answer,
            }));

            // 3. Create questions using the new test ID
            const questionsResponse = await axiosInstance.post('/api/preselectiontest/questions', {
                testId: newTestId,
                questions: formattedQuestions,
            });

            // 4. Handle images (if any)
            const formData = new FormData();
            values.questions.forEach((q, index) => {
                if (q.image) {
                    formData.append(`images[${index}]`, q.image);
                }
            });
            if (formData.entries().next().value) { //check if formdata has data.
                await axiosInstance.post(`/api/preselectiontest/${newTestId}/images`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            // 5. Update the test's isActive status
            await axiosInstance.patch(`/api/preselectiontest/${newTestId}`, {
                isActive: values.isActive,
            });

            toast.success('Test created successfully!');
            router.back();
        } catch (error: any) {
            toast.error('Error: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-10">
            <h2>Create Pre-Selection Test</h2>
            <NewForm
                initialValues={initialValues}
                validationSchema={undefined}
                onSubmit={onSubmit}
                fields={fields}
                disabled={loading}
            />
        </div>
    );
};

export default CreatePreSelectionTest;
