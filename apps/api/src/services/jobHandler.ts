import prisma from '@/prisma';

export const createJobHandler = async (jobData: any) => {
  const { title, description, category, location, salaryRange, deadline, companyId } = jobData;
  return await prisma.job.create({
    data: {
      title,
      description,
      category,
      location,
      salaryRange,
      deadline,
      companyId,
      isPublished: false,
    },
  });
};

export const updateJobHandler = async (id: string, data: any) => {
  if (data.companyId) {
    data.company = { connect: { id: data.companyId } };
    delete data.companyId;
  }
  return await prisma.job.update({
    where: { id },
    data,
  });
};

export const deleteJobHandler = async (id: string) => {
  return await prisma.job.delete({ where: { id } });
};


export const getAllJobsHandler = async (accountId: string) => {
  // Find the company associated with the given accountId
  const company = await prisma.company.findUnique({
    where: { accountId },
    select: { id: true },
  });

  if (!company) {
    throw new Error('Company not found');
  }

  // Fetch all jobs for the found company ID
  return await prisma.job.findMany({
    where: { companyId: company.id },
    include: { applicants: true },
    orderBy: { createdAt: 'desc' },
  });
};


export const getJobDetailsHandler = async (id: string) => {
  return await prisma.job.findUnique({
    where: { id },
    include: { applicants: true },
  });
};

export const togglePublishHandler = async (id: string) => {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) throw new Error('Job not found');
  return await prisma.job.update({
    where: { id },
    data: { isPublished: !job.isPublished },
  });
};
