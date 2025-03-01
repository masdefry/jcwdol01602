import prisma from '@/prisma';

export const getUserDemographics = async () => {
  try {
    const demographics = await prisma.profile.findMany({
      select: {
        gender: true,
        birthDate: true,
        address: true,
        account: { select: { id: true } },
      },
    });

    return demographics.map((profile) => ({
      gender: profile.gender,
      age: profile.birthDate
        ? new Date().getFullYear() - profile.birthDate.getFullYear()
        : null,
      location: profile.address,
      accountId: profile.account.id,
    }));
  } catch (error) {
    throw error;
  }
};

export const getSalaryTrends = async () => {
  try {
    const salaryTrends = await prisma.applicant.findMany({
      select: {
        expectedSalary: true,
        job: { select: { title: true, location: true } },
      },
    });

    return salaryTrends.map((applicant) => ({
      expectedSalary: applicant.expectedSalary,
      jobTitle: applicant.job.title,
      jobLocation: applicant.job.location,
    }));
  } catch (error) {
    throw error;
  }
};

export const getApplicantInterests = async () => {
  try {
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        category: true,
        applicants: { select: { id: true } },
      },
    });

    const categoryCounts: { [key: string]: number } = {};
    jobs.forEach((job) => {
      if (job.category) {
        categoryCounts[job.category] =
          (categoryCounts[job.category] || 0) + job.applicants.length;
      }
    });

    return Object.entries(categoryCounts).map(([category, count]) => ({
      jobCategory: category,
      applicantCount: count,
    }));
  } catch (error) {
    throw error;
  }
};

export const getJobPostStatistics = async () => {
  try {
    const jobStats = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            applicants: true,
          },
        },
      },
    });

    return jobStats.map((job) => ({
      jobId: job.id,
      jobTitle: job.title,
      applicantCount: job._count.applicants,
    }));
  } catch (error) {
    throw error;
  }
};

export const getNewUsersPerMonth = async () => {
  try {
    const users = await prisma.account.findMany({
      select: {
        createdAt: true,
      },
    });

    const userCounts = users.reduce((acc, user) => {
      const month = user.createdAt.toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(userCounts).map(([month, count]) => ({
      month,
      userCount: count,
    }));
  } catch (error) {
    throw error;
  }
};
