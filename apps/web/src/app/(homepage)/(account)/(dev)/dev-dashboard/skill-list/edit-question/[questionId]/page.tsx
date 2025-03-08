'use client';
import { ReturnBtn } from '@/components/button/moreBtn';
import { Heading } from '@/components/heading';
import NewForm from '@/components/newForm';
import axiosInstance from '@/lib/axios';
import { ISkillQuestion } from '@/lib/interface';
import { QuestionSchema } from '@/lib/skillSchemas';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const EditQuestion = () => {
  const { questionId } = useParams();
  const [loading, setLoading] = useState(false);
  const [oldQuestion, setOldQuestion] = useState<ISkillQuestion>();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState({
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    answer: '',
    image: '',
  });

  const getOldQuestion = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/skill/get-question/${questionId}`,
      );

      setOldQuestion(data.question);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.dismiss();
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    getOldQuestion();
  }, [questionId]);

  useEffect(() => {
    if (oldQuestion) {
      setInitialValues({
        question: oldQuestion.question,
        option_a: oldQuestion.option_a,
        option_b: oldQuestion.option_b,
        option_c: oldQuestion.option_c,
        option_d: oldQuestion.option_d,
        answer: oldQuestion.answer,
        image: oldQuestion.imageUrl ?? '',
      });
    }
  }, [oldQuestion]);

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
      console.log('Value : ' + JSON.stringify(values));

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
      const { data } = await axiosInstance.patch(
        `/api/skill/edit-question/${questionId}`,
        formData,
      );
      toast.success(data.message);
      setTimeout(
        () =>
          router.push(
            `/dev-dashboard/skill-list/questions/${oldQuestion?.skillId}`,
          ),
        1500,
      );
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
      <div className="flex items-center justify-between">
        <Heading title="Edit question" description="Form for edit question" />
        <ReturnBtn
          title="Back"
          runFunction={() =>
            router.push(
              `/dev-dashboard/skill-list/questions/${oldQuestion?.skillId}`,
            )
          }
        />
      </div>
      <hr className="border-2 border-purple-500" />
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

export default EditQuestion;
