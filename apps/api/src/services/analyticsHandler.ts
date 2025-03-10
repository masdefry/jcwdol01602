import prisma from '@/prisma';

export const getUserDob = async () => {
  try {
    const userProfiles = await prisma.userProfile.findMany({
      select: {
        dob: true,
        SubsData: {
          select: {
            accounts: {
              select: { id: true },
            },
          },
        },
      },
    });

    return userProfiles.map((profile) => ({
      dob: profile.dob,
      accountId: profile.SubsData.accounts.id,
    }));
  } catch (error) {
    console.error("Error fetching user DOB:", error);
    throw new Error("Failed to fetch user DOB.");
  }
};


export const getUserGender = async () => {
  try {
    const userProfiles = await prisma.userProfile.findMany({
      select: {
        gender: true,
        SubsData: {
          select: {
            accounts: {
              select: { id: true },
            },
          },
        },
      },
    });

    return userProfiles.map((profile) => ({
      gender: profile.gender,
      accountId: profile.SubsData.accounts.id,
    }));
  } catch (error) {
    console.error("Error fetching user gender:", error);
    throw new Error("Failed to fetch user gender.");
  }
};

export const getUserLocation = async () => {
  try {
    const userProfiles = await prisma.userProfile.findMany({
      select: {
        address: true,
        SubsData: {
          select: {
            accounts: {
              select: { id: true },
            },
          },
        },
      },
    });

    return userProfiles.map((profile) => ({
      location: profile.address,
      accountId: profile.SubsData.accounts.id,
    }));
  } catch (error) {
    console.error("Error fetching user location:", error);
    throw new Error("Failed to fetch user location.");
  }
};

export const getSalaryTrends = async () => {
  try {
    const salaryTrends = await prisma.applicant.findMany({
      select: {
        expectedSalary: true,
        job: {
          select: {
            title: true,
            location: true,
          },
        },
      },
    });

    return salaryTrends.map((applicant) => ({
      expectedSalary: applicant.expectedSalary,
      jobTitle: applicant.job.title,
      jobLocation: applicant.job.location,
    }));
  } catch (error) {
    console.error("Error fetching salary trends:", error);
    throw new Error("Failed to fetch salary trends.");
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
    console.error("Error fetching applicant interests:", error);
    throw new Error("Failed to fetch applicant interests.");
  }
};

export const getJobPostStatistics = async () => {
  try {
    const jobStats = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: { applicants: true },
        },
      },
    });

    return jobStats.map((job) => ({
      jobId: job.id,
      jobTitle: job.title,
      applicantCount: job._count.applicants,
    }));
  } catch (error) {
    console.error("Error fetching job post statistics:", error);
    throw new Error("Failed to fetch job post statistics.");
  }
};

export const getNewUsersPerMonth = async () => {
  try {
    const users = await prisma.account.findMany({
      select: { createdAt: true },
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
    console.error("Error fetching new users per month:", error);
    throw new Error("Failed to fetch new users per month.");
  }
};
