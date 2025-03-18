import prisma from '@/prisma';
import { addCldCv, delCldCv } from './cloudinary';
import { cvIdMaker } from '@/lib/cvIdMaker';
import { getSubsDataByUser } from './subsDataHandler';

export const addCvHandler = async (
  userId: string,
  file: Express.Multer.File,
) => {
  try {
    const cvId = await cvIdMaker();
    const cldFileUrl = await addCldCv(userId, cvId, file);
    const data = await prisma.cvData.create({
      data: {
        id: cvId,
        cvPath: cldFileUrl,
        accountId: userId,
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - addCvHandler ' + error);
  }
};

export const delCVHandler = async (userId: string, cvId: string) => {
  try {
    const subsData = await getSubsDataByUser(userId);
    if (!subsData) throw new Error(`No subscription data found`);
    const cv = await prisma.cvData.findUnique({
      where: { id: cvId },
    });
    if (!cv) throw new Error(`No Cv data found!`);
    if (cv.accountId !== userId)
      throw new Error(`This CV is not belong to you!`);
    if (subsData.selectedCv?.id === cv.id) {
      await prisma.subsData.update({
        where: { id: subsData.id },
        data: {
          cvId: null,
        },
      });
    }
    await delCldCv(cv.cvPath);
    const deletedData = await prisma.cvData.delete({
      where: { id: cv.id },
    });
    return deletedData;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - delCVHandler ' + error);
  }
};

export const getCvByUser = async (userId: string) => {
  try {
    const data = await prisma.cvData.findMany({
      where: { accountId: userId },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - getCvByUser ' + error);
  }
};

export const getCvById = async (cvId: string) => {
  try {
    const data = await prisma.cvData.findUnique({
      where: { id: cvId },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - getCvById ' + error);
  }
};
