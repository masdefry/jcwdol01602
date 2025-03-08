'use client';
import NewForm from '@/components/newForm';
import axiosInstance from '@/lib/axios';
import { QuestionSchema } from '@/lib/skillSchemas';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const SkillQuestion = () => {
  const { skillId } = useParams();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const initialValues = {
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    answer: '',
    image: '',
  };
  const fields: {
    name: string;
    label: string;
    type: 'text' | 'select' | 'checkbox' | 'textarea' | 'file';
  }[] = [
    { name: 'question', label: 'Question', type: 'text' },
    { name: 'option_a', label: 'Option A', type: 'text' },
    { name: 'option_b', label: 'Option B', type: 'text' },
    { name: 'option_c', label: 'Option C', type: 'text' },
    { name: 'option_d', label: 'Option D', type: 'text' },
    { name: 'answer', label: 'Answer', type: 'text' },
    { name: 'image', label: 'Project Image (optional)', type: 'file' },
  ];

  const onSubmit = async (values: typeof initialValues) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('question', values.question);
      formData.append(
        'options',
        JSON.stringify([
          values.option_a,
          values.option_b,
          values.option_c,
          values.option_d,
        ]),
      );
      formData.append('answer', values.answer);
      formData.append('image', values.image);
      const { data } = await axiosInstance.post(
        `/api/skill/new-question/${skillId}`,
        formData,
      );
      toast.success(data.message);
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10">
      <h1 className="text-xl font-semibold">New Question</h1>
      <hr className="border-2 border-purple-500" />
      {/* <NewForm /> */}
      <NewForm
        initialValues={initialValues}
        validationSchema={QuestionSchema}
        onSubmit={onSubmit}
        fields={fields}
        disabled={loading}
      />
    </div>
  );
};

export default SkillQuestion;
