'use client';
import PreTest from '@/components/takeTest/preTest';
import useSkillData from '@/hooks/useSkillData';
import axiosInstance from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const TakeTest = () => {
  const { userSkillId, skillId } = useParams() as {
    userSkillId: string;
    skillId: string;
  };
  const { skillData, skillQuestions } = useSkillData(skillId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [testStarted, setTestStarted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) handleSubmit();
  }, [testStarted, timeLeft]);

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleSelectAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    const currentQuestionId = skillQuestions[currentQuestionIndex].id;

    if (!selectedAnswers[currentQuestionId]) {
      toast.error('Please answer this question');
      return;
    }
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formattedAnswers = Object.entries(selectedAnswers).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        }),
      );

      const { data } = await axiosInstance.post(
        `/api/skill/submit-assestment/${userSkillId}`,
        {
          skillId,
          answers: formattedAnswers,
        },
      );

      toast.success(data.message);
      setShowResults(true);
      setTimeout(() => router.push('/user-data/profile'), 1500);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Submission failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-2 ">
      <div className="bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-lg text-white p-2 shadow-md flex justify-between">
        <h1 className="text-xl font-bold">
          Assesstment Test for "{skillData?.name}" Skill
        </h1>
      </div>
      {skillQuestions.length === 0 || !skillData ? (
        <p className="text-center text-gray-500 p-4">No question available</p>
      ) : !testStarted ? (
        <PreTest onStart={handleStartTest} />
      ) : (
        <>
          <div className=" mt-2 relative font-semibold text-lg px-2">
            Time left :⏳ {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
          {!showResults ? (
            <>
              <div className="bg-slate-200 p-2 my-2 rounded-lg shadow-md flex flex-col gap-2 border-2 border-gray-600">
                {skillQuestions[currentQuestionIndex].imageUrl && (
                  <div className="flex justify-center">
                    <img
                      src={skillQuestions[currentQuestionIndex].imageUrl || ''}
                      alt="Question"
                      className="w-full max-w-sm rounded-lg"
                    />
                  </div>
                )}
                <div className="flex justify-center">
                  <p className="font-semibold">
                    {skillQuestions[currentQuestionIndex].question}
                  </p>
                </div>
                <div className="flex justify-start mx-10 md:mx-52">
                  <div>
                    {['option_a', 'option_b', 'option_c', 'option_d'].map(
                      (key) => {
                        const optionValue = (
                          skillQuestions[currentQuestionIndex] as any
                        )[key];
                        return (
                          <label key={optionValue} className="block">
                            <input
                              type="radio"
                              name={`question-${skillQuestions[currentQuestionIndex].id}`}
                              value={optionValue}
                              checked={
                                selectedAnswers[
                                  skillQuestions[currentQuestionIndex].id
                                ] === optionValue
                              }
                              onChange={() =>
                                handleSelectAnswer(
                                  skillQuestions[currentQuestionIndex].id,
                                  optionValue,
                                )
                              }
                            />
                            <span className="ml-2">{optionValue}</span>
                          </label>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {currentQuestionIndex < skillQuestions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Submit
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="my-2 bg-green-100 border border-green-500 text-green-700 p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-2">Thank You!</h2>
              <p>
                Thank you for completing HTML Skill assessment. Please check
                your assessment result tab to see the score.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TakeTest;
