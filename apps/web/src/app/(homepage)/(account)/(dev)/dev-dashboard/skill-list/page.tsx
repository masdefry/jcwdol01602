'use client';
import { AddBtn, DeleteBtn, DetailBtn } from '@/components/button/moreBtn';
import { Heading } from '@/components/heading';
import ModalCreate from '@/components/table/modalCreate';
import TableDashboard from '@/components/table/table';
import axiosInstance from '@/lib/axios';
import { ISkill } from '@/lib/interface';
import { newSkillSchema } from '@/lib/skillSchemas';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ITableData {
  id: string;
  skillId: string;
  name: string;
  createdById: string;
  createdAt: string;
  questions: () => JSX.Element;
}

const SkillList = () => {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const router = useRouter();
  const getSkillList = async () => {
    try {
      const { data } = await axiosInstance.get('/api/skill/all-skill');
      setSkills(data.skills);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };
  useEffect(() => {
    getSkillList();
  }, []);

  const handleDelete = async (skillId: string) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/skill/delete/${skillId}`,
      );
      toast.success(data.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  const handleNewQuestion = (skillId: string) => {
    router.push(`/dev-dashboard/skill-list/new-question/${skillId}`);
  };

  const handleDetailQuestions = (skillId: string) => {
    router.push(`/dev-dashboard/skill-list/questions/${skillId}`);
  };
  interface IActionButton {
    skill: ISkill;
  }
  const ActionButton = ({ skill }: IActionButton) => {
    return (
      <>
        <div className="flex flex-col lg:flex-row gap-2">
          <DeleteBtn runFunction={() => handleDelete(skill.id)} />
          <AddBtn
            title="Question"
            runFunction={() => handleNewQuestion(skill.id)}
          />
        </div>
      </>
    );
  };

  const tableData: ITableData[] = skills.map((skill) => ({
    id: skill.id,
    skillId: skill.id,
    name: skill.name,
    createdById: skill.createdById,
    createdAt: new Date(skill.createdAt).toLocaleDateString(),
    questions: () => (
      <DetailBtn runFunction={() => handleDetailQuestions(skill.id)} />
    ),
    actions: () => <ActionButton skill={skill} />,
  }));

  const initialValues = {
    skillName: '',
  };

  const handleNewSkill = async (values: typeof initialValues) => {
    try {
      const { data } = await axiosInstance.post('/api/skill/new', values);
      toast.success(data.message);
      const newSkill: ISkill = {
        id: data.skill.id,
        name: data.skill.name,
        createdById: data.skill.createdById,
        createdAt: data.skill.createdAt,
      };

      setSkills((prev) => [...prev, newSkill]);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    } finally {
      setAddModalOpen(false);
    }
  };

  const fields = [{ name: `skillName`, label: 'Name', type: 'text' as const }];
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Skill List" description="List of all skill" />
        <AddBtn
          title="Add new Skill"
          runFunction={() => setAddModalOpen(true)}
        />
      </div>
      <TableDashboard
        columns={[
          'No',
          'Skill Id',
          'Name',
          'Created By',
          'Created At',
          'Questions',
          'Actions',
        ]}
        datas={tableData}
        itemsPerPage={5}
      />
      {addModalOpen && (
        <ModalCreate
          title="Create New Skill"
          initialValues={initialValues}
          validationSchema={newSkillSchema}
          onSubmit={handleNewSkill}
          isOpen={addModalOpen}
          setIsOpen={setAddModalOpen}
          disabled={false}
          fields={fields}
        />
      )}
    </>
  );
};

export default SkillList;
