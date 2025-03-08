import prisma from '@/prisma';



export const createJobHandler = async (jobData: any, accountId: string) => {
  const { title, description, category, location, salaryRange, deadline } = jobData;

  const company = await prisma.company.findUnique({
    where: { accountId },
    select: { id: true },
  });

  if (!company) {
    throw new Error('Company not found for the given accountId');
  }

  return await prisma.job.create({
    data: {
      title,
      description,
      category,
      location,
      salaryRange,
      deadline,
      companyId: company.id,
      isPublished: false,
    },
  });
};

export const updateJobHandler = async (id: string, data: any, accountId: string) => {
  // Find the company associated with the given accountId
  const company = await prisma.company.findUnique({
    where: { accountId },
    select: { id: true },
  });

  if (!company) {
    throw new Error('Company not found for the given accountId');
  }

  // Ensure the job being updated belongs to the company associated with the accountId
  const job = await prisma.job.findUnique({
    where: { id },
    select: { companyId: true },
  });

  if (!job || job.companyId !== company.id) {
    throw new Error('Job not found or does not belong to the company associated with the given accountId');
  }

  return await prisma.job.update({
    where: { id },
    data,
  });
};

export const deleteJobHandler = async (id: string, accountId: string) => {
    // Find the company associated with the given accountId
    const company = await prisma.company.findUnique({
      where: { accountId },
      select: { id: true },
    });

    if (!company) {
      throw new Error('Company not found for the given accountId');
    }

    // Ensure the job being deleted belongs to the company associated with the accountId
    const job = await prisma.job.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!job || job.companyId !== company.id) {
      throw new Error('Job not found or does not belong to the company associated with the given accountId');
    }

    return await prisma.job.delete({ where: { id } });
};

export const getAllJobsHandler = async (accountId: string) => {
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

export const getJobDetailsHandler = async (id: string, accountId: string) => {
    // Find the company associated with the given accountId
    const company = await prisma.company.findUnique({
      where: { accountId },
      select: { id: true },
    });

    if (!company) {
      throw new Error('Company not found for the given accountId');
    }

    // Ensure the job being viewed belongs to the company associated with the accountId
    const job = await prisma.job.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!job || job.companyId !== company.id) {
      throw new Error('Job not found or does not belong to the company associated with the given accountId');
    }

  return await prisma.job.findUnique({
    where: { id },
    include: { applicants: true },
  });
};

export const togglePublishHandler = async (id: string, accountId: string) => {
    // Find the company associated with the given accountId
    const company = await prisma.company.findUnique({
      where: { accountId },
      select: { id: true },
    });

    if (!company) {
      throw new Error('Company not found for the given accountId');
    }

    // Ensure the job being toggled belongs to the company associated with the accountId
    const job = await prisma.job.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!job || job.companyId !== company.id) {
      throw new Error('Job not found or does not belong to the company associated with the given accountId');
    }

  const jobToToggle = await prisma.job.findUnique({ where: { id } });
  if (!jobToToggle) throw new Error('Job not found');
  return await prisma.job.update({
    where: { id },
    data: { isPublished: !jobToToggle.isPublished },
  });
};
