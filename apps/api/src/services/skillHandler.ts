import prisma from '@/prisma';

export const getSkillById = async (skillId: string) => {
  try {
    const data = await prisma.skill.findUnique({
      where: { id: skillId },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
