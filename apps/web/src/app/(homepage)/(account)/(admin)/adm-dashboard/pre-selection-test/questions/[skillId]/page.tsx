'use client';
import { DeleteBtn, DetailBtn, EditBtn } from '@/components/button/moreBtn';
import { Heading } from '@/components/heading';
import ModalDetail from '@/components/table/modalDetail';
import TableDashboard from '@/components/table/table';
import axiosInstance from '@/lib/axios';
import { ISkillQuestion } from '@/lib/interface';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ITableData {
  id: string;
  questionId: string;
  details: (setIsOpen: (isOpen: boolean) => void) => JSX.Element;
}

const QuestionsSkill = () => {
  const { skillId } = useParams();
  const [questions, setQuestions] = useState<ISkillQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<ISkillQuestion>();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const router = useRouter();

  const getQuestionsBySkill = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/skill/all-question/${skillId}`,
      );
      setQuestions(data.allSkillQuest);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };
  useEffect(() => {
    getQuestionsBySkill();
  }, []);

  const handleDelete = async (questionId: string) => {
    try {
      console.log(questionId);
      const { data } = await axiosInstance.delete(
        `/api/skill/delete-question/${questionId}`,
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
    router.push(`/dev-dashboard/skill-list/edit-question/${questionId}`);
    try {
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  const handleDetailModal = (question: ISkillQuestion) => {
    setSelectedQuestion(question);
    setIsDetailOpen(true);
  };

  interface IActionButton {
    question: ISkillQuestion;
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
          title="Question List"
          description={`For skill id : ${skillId}`}
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

export default QuestionsSkill;
