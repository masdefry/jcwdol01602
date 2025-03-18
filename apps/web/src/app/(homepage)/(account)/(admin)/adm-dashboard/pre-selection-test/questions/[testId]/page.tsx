'use client';
import { AddBtn, DeleteBtn } from '@/components/button/moreBtn';
import { Heading } from '@/components/heading';
import TableDashboard from '@/components/table/table';
import { Job, Categories, Locations } from '@/types/job';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import JobService from '@/services/job.service';
import useAuthStore from "@/stores/authStores";
import { useRouter, useParams } from 'next/navigation';
import FilterSortControls from '@/components/adminDashboard/filterAndSortJob';
import JobModal from '@/components/adminDashboard/jobModal';
import axiosInstance from '@/lib/axios';

interface IPreSelectionQuestion {
    id: string;
    testId: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    answer: string;
    imageUrl?: string;
}

interface IJobData {
    id: string;
    title: string;
    location: string;
    applicantsCount: number;
    deadline: string;
}

const QuestionsPreSelectionTest = () => {
    const { testId } = useParams();
    const [questions, setQuestions] = useState<IPreSelectionQuestion[]>([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editQuestion, setEditQuestion] = useState<IPreSelectionQuestion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const account = useAuthStore((state) => state.account);
    const router = useRouter();

    const getQuestionsByTest = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.get(
                `/api/preselectiontest/${testId}`,
            );
            setQuestions(data.test.questions);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getQuestionsByTest();
    }, [testId]);


    const handleNewQuestion = async (values: Omit<IPreSelectionQuestion, 'id'>) => {
        try {
            if (editQuestion) {
                console.log("Data sent for update:", values); // Added console.log
                await axiosInstance.patch(`/api/preselectiontest/questions/${editQuestion.id}`, values);
                setQuestions((prev) =>
                    prev.map((question) => (question.id === editQuestion.id ? { ...question, ...values } : question))
                );
                console.log();
                toast.success('Question updated successfully.');
            } else {
                console.log("Data sent for creation:", { ...values, testId: testId }); // Added console.log
                await axiosInstance.post(`/api/preselectiontest/questions`, { ...values, testId: testId });
                getQuestionsByTest();
                toast.success('Question created successfully.');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to perform question operation.';
            toast.error(errorMessage);
        } finally {
            setAddModalOpen(false);
            setEditQuestion(null);
        }
    };

    const tableData: any[] = questions.map(question => ({
        id: question.id,
        question: question.question,
        actions: () => (
            <div className="flex gap-2">
                <button
                    onClick={() => {
                        setEditQuestion(question);
                        setAddModalOpen(true);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                    Edit
                </button>
            </div>
        ),
    }));

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <Heading title="Pre-Selection Question Management" description="Manage all questions" />
                <AddBtn title="Add Question" runFunction={() => setAddModalOpen(true)} />
            </div>
            {isLoading ? (
                <p>Loading Questions...</p>
            ) : (
                <TableDashboard
                    columns={[
                        'No',
                        'Question',
                        'Actions',
                    ]}
                    datas={tableData}
                    itemsPerPage={5}
                />
            )}
            <QuestionModal
                editQuestion={editQuestion}
                addModalOpen={addModalOpen}
                setAddModalOpen={setAddModalOpen}
                handleNewQuestion={handleNewQuestion}
            />
        </div>
    );
};

interface QuestionModalProps {
    editQuestion: IPreSelectionQuestion | null;
    addModalOpen: boolean;
    setAddModalOpen: (open: boolean) => void;
    handleNewQuestion: (values: Omit<IPreSelectionQuestion, 'id'>) => Promise<void>;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
    editQuestion,
    addModalOpen,
    setAddModalOpen,
    handleNewQuestion,
}) => {
    const [question, setQuestion] = useState<Omit<IPreSelectionQuestion, 'id'>>({
        testId: '',
        question: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        answer: '',
        imageUrl: '',
    });

    useEffect(() => {
        if (editQuestion) {
            setQuestion({
                testId: editQuestion.testId,
                question: editQuestion.question,
                option_a: editQuestion.option_a,
                option_b: editQuestion.option_b,
                option_c: editQuestion.option_c,
                option_d: editQuestion.option_d,
                answer: editQuestion.answer,
                imageUrl: editQuestion.imageUrl || '',
            });
        } else {
            setQuestion({
                testId: '',
                question: '',
                option_a: '',
                option_b: '',
                option_c: '',
                option_d: '',
                answer: '',
                imageUrl: '',
            });
        }
    }, [editQuestion]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setQuestion({ ...question, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleNewQuestion(question);
    };

    return (
        <div
            className={`${addModalOpen ? 'block' : 'hidden'} fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full`}
        >
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {editQuestion ? 'Edit Question' : 'Add Question'}
                    </h3>
                    <div className="mt-2 px-7 py-3">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="question"
                                value={question.question}
                                onChange={handleChange}
                                placeholder="Question"
                                className="border rounded w-full py-2 px-3 mb-2"
                            />
                            <input
                                type="text"
                                name="option_a"
                                value={question.option_a}
                                onChange={handleChange}
                                placeholder="Option A"
                                className="border rounded w-full py-2 px-3 mb-2"
                            />
                            <input
                                type="text"
                                name="option_b"
                                value={question.option_b}
                                onChange={handleChange}
                                placeholder="Option B"
                                className="border rounded w-full py-2 px-3 mb-2"
                            />
                            <input
                                type="text"
                                name="option_c"
                                value={question.option_c}
                                onChange={handleChange}
                                placeholder="Option C"
                                className="border rounded w-full py-2 px-3 mb-2"
                            />
                            <input
                                type="text"
                                name="option_d"
                                value={question.option_d}
                                onChange={handleChange}
                                placeholder="Option D"
                                className="border rounded w-full py-2 px-3 mb-2"
                            />
                            <input
                                type="text"
                                name="answer"
                                value={question.answer}
                                onChange={handleChange}
                                placeholder="Answer"
                                className="border rounded w-full py-2 px-3 mb-2"
                            />
                            <input
                                type="text"
                                name="imageUrl"
                                value={question.imageUrl}
                                onChange={handleChange}
                                placeholder="Image URL (optional)"
                                className="border rounded w-full py-2 px-3 mb-4"
                            />
                            <div className="items-center px-4 py-3">
                                <button
                                    id="ok-btn"
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                                >
                                    {editQuestion ? 'Update' : 'Add'}
                                </button>
                                <button
                                    onClick={() => setAddModalOpen(false)}
                                    type="button"
                                    className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionsPreSelectionTest;
