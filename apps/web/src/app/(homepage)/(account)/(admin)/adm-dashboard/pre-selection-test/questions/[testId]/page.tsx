'use client';
import { DeleteBtn, DetailBtn, EditBtn } from '@/components/button/moreBtn';
import { Heading } from '@/components/heading';
import ModalDetail from '@/components/table/modalDetail';
import TableDashboard from '@/components/table/table';
import axiosInstance from '@/lib/axios';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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

interface ITableData {
    id: string;
    questionId: string;
    details: (setIsOpen: (isOpen: boolean) => void) => JSX.Element;
}

const QuestionsPreSelectionTest = () => {
    const { testId } = useParams();
    const [questions, setQuestions] = useState<IPreSelectionQuestion[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<IPreSelectionQuestion>();
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const router = useRouter();

    const getQuestionsByTest = async () => {
        try {
            const { data } = await axiosInstance.get(
                `/api/preselectiontest/${testId}`,
            );
            setQuestions(data.test.questions);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        getQuestionsByTest();
    }, [testId]);

    const handleDelete = async (questionId: string) => {
        try {
            const { data } = await axiosInstance.delete(
                `/api/preselectiontest/question/${questionId}`,
            );
            toast.success(data.message);
            setQuestions((prevQuestions) =>
                prevQuestions.filter((q) => q.id !== questionId),
            );
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
        }
    };

    const handleEdit = async (questionId: string) => {
        router.push(`/adm-dashboard/pre-selection-test/edit-question/${questionId}`);
        try {
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
        }
    };

    const handleDetailModal = (question: IPreSelectionQuestion) => {
        setSelectedQuestion(question);
        setIsDetailOpen(true);
    };

    interface IActionButton {
        question: IPreSelectionQuestion;
    }

    const ActionButton = ({ question }: IActionButton) => {
        return (
            <>
                <div className="flex flex-col lg:flex-row gap-2">
                    <DeleteBtn runFunction={() => handleDelete(question.id)} />
                    <EditBtn runFunction={() => handleEdit(question.id)} />
                </div>
            </>
        );
    };

    const tableData: ITableData[] = questions.map((question) => ({
        id: question.id,
        questionId: question.id,
        details: () => (
            <DetailBtn runFunction={() => handleDetailModal(question)} />
        ),
        actions: () => <ActionButton question={question} />,
    }));

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Pre-Selection Question List"
                    description={`For test id : ${testId}`}
                />
            </div>
            <TableDashboard
                columns={['No', 'Question Id', 'Details', 'Actions']}
                datas={tableData}
                itemsPerPage={5}
            />
            {isDetailOpen && selectedQuestion && (
                <ModalDetail data={selectedQuestion} setIsOpen={setIsDetailOpen} />
            )}
        </>
    );
};

export default QuestionsPreSelectionTest;
