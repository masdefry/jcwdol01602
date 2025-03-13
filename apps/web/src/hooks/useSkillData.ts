import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { ISkill, ISkillQuestion } from '@/lib/interface';
import toast from 'react-hot-toast';

const shuffleArray = (array: ISkillQuestion[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const useSkillData = (skillId: string) => {
  const [skillData, setSkillData] = useState<ISkill>();
  const [skillQuestions, setSkillQuestions] = useState<ISkillQuestion[]>([]);

  useEffect(() => {
    const fetchSkillData = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/skill/data/${skillId}`);
        setSkillData(data.skill);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'Failed to fetch skill data.',
        );
      }
    };

    const fetchSkillQuestions = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/skill/all-question/${skillId}`,
        );
        setSkillQuestions(shuffleArray(data.allSkillQuest));
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'Failed to fetch questions.',
        );
      }
    };

    fetchSkillData();
    fetchSkillQuestions();
  }, [skillId]);

  return { skillData, skillQuestions };
};

export default useSkillData;
