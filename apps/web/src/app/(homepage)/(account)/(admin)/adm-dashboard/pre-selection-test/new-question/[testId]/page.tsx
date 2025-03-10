'use client';
import React, { useState } from 'react';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import NewForm from '@/components/newForm';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStores';

const CreatePreSelectionTest: React.FC = () => {
  const router = useRouter();
  const account = useAuthStore((state) => state.account);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    jobId: '',
    isActive: false,
    questions: Array.from({ length: 25 }, () => ({
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
    ...Array.from({ length: 25 }, (_, index) => [
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
    if (!account?.id) {
      toast.error('Account ID is not available.');
      return;
    }
    setLoading(true);
    try {
      const formattedQuestions = values.questions.map((q) => {
        const formData = new FormData();
        formData.append('question', q.question);
        formData.append(
          'options',
          JSON.stringify([q.option_a, q.option_b, q.option_c, q.option_d]),
        );
        formData.append('answer', q.answer);
        if (q.image) {
          formData.append('image', q.image);
        }
        return formData;
      });

      const response = await axiosInstance.post('/api/preselectiontest', {
        jobId: values.jobId,
        isActive: values.isActive,
        questions: formattedQuestions.map(formData => Object.fromEntries(formData)),
        accountId: account.id,
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
