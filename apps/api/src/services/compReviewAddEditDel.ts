import prisma from '@/prisma';
import { compReviewIdMaker } from '@/lib/reviewId';
import { getCompReviewById } from './compReviewGet';
import { Role } from '@prisma/client';
import { Account } from '@/custom';
import { getAllWorkerByUser } from './workerGet';
import { getCompanyByAdmin } from './companyHandler';

export const addCompReview = async (
  userId: string,
  companyId: string,
  salary: number | null,
  culture: number | null,
  wlb: number | null,
  facility: number | null,
  career: number | null,
  desc: string | null,
) => {
  try {
    let salaryRange = null;
    let cultureRating = null;
    let wlbRating = null;
    let facilityRating = null;
    let careerRating = null;
    let description = null;
    // get worker by userId
    const workerData = await getAllWorkerByUser(userId);
    if (workerData.length === 0) throw new Error(`No Data`);

    // Check companyId
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) throw new Error(`Company doesn't exist`);

    // find company in worker
    const matchedWorker = workerData.find(
      (worker) => worker.companyId === company.id && worker.isVerified,
    );
    if (!matchedWorker)
      throw new Error(`User is not associated with this company`);
    if (salary) salaryRange = salary;
    if (culture) cultureRating = culture;
    if (wlb) wlbRating = culture;
    if (facility) facilityRating = facility;
    if (career) careerRating = career;
    if (desc) description = desc;

    const compReviewId = await compReviewIdMaker();
    const data = await prisma.compReview.create({
      data: {
        id: compReviewId,
        companyId: company.id,
        workerId: matchedWorker.id,
        salary: salaryRange,
        culture: cultureRating,
        wlb: wlbRating,
        facility: facilityRating,
        career: careerRating,
        description,
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - addCompReview : ` + error);
  }
};

export const editCompReview = async (
  userId: string,
  compReviewId: string,
  salary: number | null,
  culture: number | null,
  wlb: number | null,
  facility: number | null,
  career: number | null,
  desc: string | null,
) => {
  try {
    // get worker by userId
    const workerData = await getAllWorkerByUser(userId);
    if (workerData.length === 0) throw new Error(`No worker data`);
    // Check compReviewId
    const compReview = await getCompReviewById(compReviewId);
    if (!compReview) throw new Error(`Invalid review Id`);
    let upSalaryRating = compReview.salary;
    let upCultureRating = compReview.culture;
    let upWlbRating = compReview.wlb;
    let upFacilityRating = compReview.facility;
    let upCareerRating = compReview.career;
    let upDescription = compReview.description;
    // Check if compReview has the same workId
    const matchedWorker = workerData.find((worker) =>
      worker.compReview.find((review) => review.id === compReview.id),
    );
    if (!matchedWorker) throw new Error(`Unauthorized`);
    if (salary) upSalaryRating = salary;
    if (culture) upCultureRating = culture;
    if (wlb) upWlbRating = wlb;
    if (facility) upFacilityRating = facility;
    if (career) upCareerRating = career;
    if (desc) upDescription = desc;
    const data = await prisma.compReview.update({
      where: { id: compReview.id },
      data: {
        salary: upSalaryRating,
        culture: upCultureRating,
        wlb: upWlbRating,
        facility: upFacilityRating,
        career: upCareerRating,
        description: upDescription,
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - editCompReview : ` + error);
  }
};

interface IAccount {
  id: string;
  role: Role;
  email: string;
  name: string;
}
export const delCompReview = async (account: Account, compReviewId: string) => {
  try {
    const compReview = await getCompReviewById(compReviewId);
    if (!compReview) throw new Error(`Review doesn't exist`);
    let data = null;
    if (account.role === 'user') {
      const workerData = await getAllWorkerByUser(account.id);
      if (workerData.length === 0)
        throw new Error(`Work experience doesn't exist`);
      const matchedWorker = workerData.find((worker) =>
        worker.compReview.find((review) => review.id === compReview.id),
      );
      if (!matchedWorker) throw new Error(`Unauthorized`);
      data = await prisma.compReview.delete({
        where: { id: compReview.id },
      });
    } else if (account.role == 'admin') {
      const company = await getCompanyByAdmin(account.id);
      if (!company) throw new Error(`Company data doesn't exist`);
      if (compReview.companyId !== company.id)
        throw new Error(`This review is not for your company`);
      data = await prisma.compReview.delete({
        where: { id: compReview.id },
      });
    } else {
      throw new Error(`Unauthorized`);
    }

    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - delCompReview : ` + error);
  }
};
