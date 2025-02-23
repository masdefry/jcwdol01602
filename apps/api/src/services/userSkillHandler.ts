import prisma from '@/prisma';
import { getSkillByName } from './skillHandler';
import { getSubsDataById, getSubsDataByUser } from './subsDataHandler';
import { userSkillIdMaker } from '@/lib/idUsers';

export const addUserSkill = async (userId: string, skillName: string) => {
  try {
    const skill = await getSkillByName(skillName);
    if (!skill) throw new Error(`Skill doesn't exist`);
    const subsData = await getSubsDataByUser(userId);
    if (!subsData) throw new Error(`Subscription data doesn't exist`);
    const userSkillId = await userSkillIdMaker(userId);
    const userSkill = await prisma.userSkill.create({
      data: {
        id: userSkillId,
        subsDataId: subsData.id,
        skillId: skill.id,
      },
    });
    return userSkill;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error - addUserSkill :' + error);
  }
};

export const getUserSkillById = async (uSkillId: string) => {
  try {
    const userSkill = await prisma.userSkill.findUnique({
      where: { id: uSkillId },
      include: {
        subsData: true,
      },
    });
    return userSkill;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error - getUserSkillById :' + error);
  }
};

export const delUserSkill = async (userId: string, uSkillId: string) => {
  try {
    const userSkill = await getUserSkillById(uSkillId);
    if (!userSkill) throw new Error(`User skill doesn't exist`);
    if (userId !== userSkill.subsData.accountId)
      throw new Error(`Unauthorized`);
    const deleteUserSkill = await prisma.userSkill.delete({
      where: { id: userSkill.id },
    });
    return deleteUserSkill;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error - delUserSkill :' + error);
  }
};
