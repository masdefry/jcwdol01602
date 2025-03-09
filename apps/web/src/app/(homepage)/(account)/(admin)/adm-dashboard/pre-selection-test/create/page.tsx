'use client';
import React, { useState } from 'react';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import NewForm from '@/components/newForm';
import { useRouter } from 'next/navigation';

const CreatePreSelectionTest: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    jobId: '',
    isActive: false,
    questions: Array.from({ length: 1 }, () => ({
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
    ...Array.from({ length: 1 }, (_, index) => [
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
      const formattedQuestions = values.questions.map((q) => {
        console.log(

        );
        return {

          question: q.question,
          options: JSON.stringify([q.option_a, q.option_b, q.option_c, q.option_d]),
          answer: q.answer,
        };
      });

      const formData = new FormData();
      formData.append('jobId', values.jobId);
      formData.append('isActive', String(values.isActive));
      formData.append('questions', JSON.stringify(formattedQuestions));

      values.questions.forEach((q, index) => {
        if (q.image) {
          formData.append(`images[${index}]`, q.image);
        }
      });

      const response = await axiosInstance.post('/api/preselectiontest/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
