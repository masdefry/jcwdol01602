import { userEduIdMaker } from '@/lib/idUsers';
import prisma from '@/prisma';
import { EduLevel } from '@prisma/client';
import { getSubsDataById, getSubsDataByUser } from './subsDataHandler';

const findEduLevel = (eduLevel: string): EduLevel => {
  if (!Object.values(EduLevel).includes(eduLevel as EduLevel)) {
    throw new Error(`Education level not found`);
  }
  return eduLevel as EduLevel;
};

export const addUserEdu = async (
  subsDataId: string,
  eduLevelName: string,
  school: string,
  discipline: string,
  beginDate: string,
  finishDate: string,
  desc?: string,
) => {
  try {
    const userEduId = await userEduIdMaker();
    const level = await findEduLevel(eduLevelName);
    const startDate = new Date(beginDate);
    let endDate = null;
    if (finishDate !== '') {
      endDate = new Date(finishDate);
    }
    let description = null;
    if (desc) {
      description = desc;
    }
    const data = await prisma.userEdu.create({
      data: {
        id: userEduId,
        subsDataId,
        level,
        school,
        discipline,
        startDate,
        endDate,
        description,
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error - addUserProf :' + error);
  }
};

export const getUserEduById = async (userEduId: string) => {
  try {
    const userEdu = await prisma.userEdu.findUnique({
      where: { id: userEduId },
      include: {
        subsData: true,
      },
    });
    return userEdu;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error - getUserEduById :' + error);
  }
};

export const allUserEduBySubsData = async (subsDataId: string) => {
  try {
    const subsData = await getSubsDataById(subsDataId);
    if (!subsData) throw new Error(`Subscription data doesn't exist`);
    const data = await prisma.userEdu.findMany({
      where: { subsDataId: subsData.id },
      orderBy: {
        endDate: 'desc',
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error - allUserEduBySubsData :' + error);
  }
};

export const editUserEdu = async (
  userId: string,
  userEduId: string,
  eduLevelName: string | null,
  school: string | null,
  discipline: string | null,
  beginDate: string | null,
  finishDate: string | null,
  desc: string | null,
) => {
  try {
    const lastUserEdu = await getUserEduById(userEduId);
    if (!lastUserEdu) throw new Error(`Education data doesn't exist`);
    // Check if the user is the owner
    if (userId !== lastUserEdu.subsData.accountId) {
      throw new Error(`Unauthorized`);
    }
    let upLevel = lastUserEdu.level;
    let upSchool = lastUserEdu.school;
    let upDiscipline = lastUserEdu.discipline;
    let upStartDate = lastUserEdu.startDate;
    let upEndDate = lastUserEdu.endDate;
    let upDesc = lastUserEdu.description;
    if (eduLevelName) {
      const level = findEduLevel(eduLevelName);
      upLevel = level;
    }
    if (school) {
      upSchool = school;
    }
    if (discipline) {
      upDiscipline = discipline;
    }
    if (beginDate) {
      const startDate = new Date(beginDate);
      upStartDate = startDate;
    }
    if (finishDate) {
      const endDate = new Date(finishDate);
      upEndDate = endDate;
    }
    if (desc) {
      upDesc = desc;
    }
    const data = await prisma.userEdu.update({
      where: { id: lastUserEdu.id },
      data: {
        level: upLevel,
        school: upSchool,
        discipline: upDiscipline,
        startDate: upStartDate,
        endDate: upEndDate,
        description: upDesc,
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error - editUserEdu :' + error);
  }
};

export const delUserEdu = async (userId: string, eduId: string) => {
  try {
    const userEdu = await getUserEduById(eduId);
    if (!userEdu) throw new Error(`Education data doesn't exist`);
    if (userId !== userEdu.subsData.accountId) {
      throw new Error(`Unauthorized`);
    }
    // user need to have atleast 1 education data
    const allUserEdu = await allUserEduBySubsData(userEdu.subsData.id);
    if (allUserEdu.length === 0) throw new Error(`No education data exist`);
    if (allUserEdu.length === 1)
      throw new Error(`User need to have atleast 1 education data`);
    const data = await prisma.userEdu.delete({
      where: { id: userEdu.id },
    });
    return data;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error - delUserEdu :' + error);
  }
};
