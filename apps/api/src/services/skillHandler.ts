import prisma from '@/prisma';

export const getSkillById = async (skillId: string) => {
  try {
    const data = await prisma.skill.findUnique({
      where: { id: skillId },
    });
    return data;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error - getSkillById :' + error);
  }
};

export const getSkillByName = async (skillName: string) => {
  try {
    const data = await prisma.skill.findFirst({
      where: { name: skillName },
    });
    return data;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error - getSkillByName :' + error);
  }
};
