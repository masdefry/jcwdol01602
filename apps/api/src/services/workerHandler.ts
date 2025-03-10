import prisma from '@/prisma';
import { getSubsDataByUser } from './subsDataHandler';
import { workerIdMaker } from '@/lib/idUsers';
import { getCompanyByAdmin } from './companyHandler';
import { getWorkerById } from './workerGet';

export const addWorkerUser = async (
  userId: string,
  companyName: string,
  position: string,
  beginDate: string,
  finishDate: string,
  desc: string,
) => {
  try {
    const subsData = await getSubsDataByUser(userId);
    if (!subsData)
      throw new Error(`Subscription data for this user doesn't exist`);
    let companyId = null;
    let companyNameData = companyName;
    // Check if company Name exist on db
    const findCompanyName = await prisma.account.findFirst({
      where: { name: companyName },
    });
    if (findCompanyName) {
      const companyData = await prisma.company.findUnique({
        where: { accountId: findCompanyName.id },
      });
      companyId = companyData?.id;
      companyNameData = findCompanyName.name;
    }
    const startDate = new Date(beginDate);
    let endDate = null;
    if (finishDate !== '') {
      endDate = new Date(finishDate);
    }
    let description = null;
    if (desc) {
      description = desc;
    }
    const workerId = await workerIdMaker();
    const data = await prisma.worker.create({
      data: {
        id: workerId,
        subsDataId: subsData.id,
        companyId,
        companyName: companyNameData,
        position,
        startDate,
        endDate,
        description,
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - addUserWork : ` + error);
  }
};

export const delUserWorker = async (userId: string, workerId: string) => {
  try {
    // Check if the user is the owner of the userWork data
    const worker = await getWorkerById(workerId);
    if (!worker) throw new Error(`Working experience doesn't exist`);
    const subsData = await getSubsDataByUser(userId);
    if (!subsData) throw new Error(`Subscription data doesn't exist`);
    if (worker.subsDataId !== subsData.id) throw new Error(`Unauthorized`);
    // Delete data
    const data = await prisma.worker.delete({
      where: { id: worker.id },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - delUserWorker : ` + error);
  }
};
export const verifyUserWorker = async (
  workerId: string,
  isVerified: boolean,
) => {
  try {
    const worker = await getWorkerById(workerId);
    if (!worker) throw new Error(`Worker data doesn't exist`);
    const data = await prisma.worker.update({
      where: { id: worker.id },
      data: {
        isVerified,
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - verifyUserWorker : ` + error);
  }
};
export const editWorkUser = async (
  userId: string,
  workerId: string,
  companyName: string,
  position: string,
  beginDate: string,
  finishDate: string,
  desc: string,
) => {
  try {
    const subsData = await getSubsDataByUser(userId);
    if (!subsData) throw new Error(`Subscription data doesn't exist`);
    const lastWorker = await getWorkerById(workerId);
    if (!lastWorker) throw new Error(`Workder data doesn't exist`);
    if (subsData.id !== lastWorker.subsDataId) throw new Error(`Unauthorized`);
    let upCompanyName = lastWorker.companyName;
    let upCompanyId: string | null | undefined = lastWorker.companyId;
    let upPosition = lastWorker.position;
    let upStartDate = lastWorker.startDate;
    let upEndDate = lastWorker.endDate;
    let upDescription = lastWorker.description;
    if (companyName) {
      const findCompanyName = await prisma.account.findFirst({
        where: { name: companyName },
      });
      if (findCompanyName) {
        const companyData = await prisma.company.findUnique({
          where: { accountId: findCompanyName.id },
        });
        upCompanyId = companyData?.id;
        upCompanyName = findCompanyName.name;
      } else {
        (upCompanyId = null), (upCompanyName = companyName);
      }
    }
    if (position) {
      upPosition = position;
    }
    if (beginDate) upStartDate = new Date(beginDate);
    if (finishDate) {
      upEndDate = new Date(finishDate);
    }
    if (desc) {
      upDescription = desc;
    }
    const data = await prisma.worker.update({
      where: { id: lastWorker.id },
      data: {
        companyId: upCompanyId,
        companyName: upCompanyName,
        position: upPosition,
        startDate: upStartDate,
        endDate: upEndDate,
        description: upDescription,
        isVerified: false,
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - editWorkUser : ` + error);
  }
};
