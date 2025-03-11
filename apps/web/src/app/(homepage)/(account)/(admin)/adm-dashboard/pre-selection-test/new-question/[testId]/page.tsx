'use client';
import React, { useState } from 'react';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import NewForm from '@/components/newForm';
import { useParams, useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStores';

const CreatePreSelectionTest: React.FC = () => {
  const router = useRouter();
  const account = useAuthStore((state) => state.account);
  const [loading, setLoading] = useState(false);
  const { testId } = useParams();
  const [questionCount, setQuestionCount] = useState(1);

  const initialValues = {
    questions: Array.from({ length: questionCount }, () => ({
      question: '',
      image: null,
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      answer: '',
    })),
  };

  const generateFields = () => {
    return Array.from({ length: questionCount }, (_, index) => [
      { name: `questions[${index}].question`, label: `Question ${index + 1}`, type: 'text' as const },
      { name: `questions[${index}].image`, label: `Image (optional)`, type: 'file' as const },
      { name: `questions[${index}].option_a`, label: `Option A`, type: 'text' as const },
      { name: `questions[${index}].option_b`, label: `Option B`, type: 'text' as const },
      { name: `questions[${index}].option_c`, label: `Option C`, type: 'text' as const },
      { name: `questions[${index}].option_d`, label: `Option D`, type: 'text' as const },
      { name: `questions[${index}].answer`, label: `Correct Answer (a, b, c, or d)`, type: 'text' as const },
    ]).flat();
  };

  const onSubmit = async (values: typeof initialValues) => {
    if (!account?.id) {
      toast.error('Account ID is not available.');
      return;
    }
    setLoading(true);
    try {
      const backendQuestions = values.questions.map((q) => {
        const backendQuestion: any = {
          question: q.question,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          answer: q.answer,
        };
        if (q.image) {
          backendQuestion.imageUrl = q.image;
        }
        return backendQuestion;
      });

      const response = await axiosInstance.post('/api/preselectiontest/questions', {
        testId: testId,
        questions: backendQuestions,
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

  const handleAddQuestion = () => {
    setQuestionCount(prevCount => prevCount + 1);
  };

  const handleRemoveQuestion = () => {
    if (questionCount > 1) {
      setQuestionCount(prevCount => prevCount - 1);
    }
  };

  return (
    <div className="px-10">
      <h2>Create Pre-Selection Test</h2>
      <div>
        <button onClick={handleAddQuestion} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          Add Question
        </button>
        <button onClick={handleRemoveQuestion} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Remove Question
        </button>
      </div>
      <NewForm
        initialValues={{ questions: Array.from({ length: questionCount }, () => ({
          question: '',
          image: null,
          option_a: '',
          option_b: '',
          option_c: '',
          option_d: '',
          answer: '',
        }))}}
        validationSchema={undefined}
        onSubmit={onSubmit}
        fields={generateFields()}
        disabled={loading}
      />
    </div>
  );
};

export default CreatePreSelectionTest;
