import prisma from '@/prisma';

export const getJobsPerPage = async (
  skip: number,
  take: number,
  location?: string,
  category?: string,
) => {
  try {
    const filter: any = { isPublished: true };

    if (location) {
      filter.location = location;
    }
    if (category) {
      filter.category = category;
    }
    const [data, total] = await prisma.$transaction([
      prisma.job.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        where: filter,
        include: {
          company: {
            include: {
              account: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
      }),
      prisma.job.count({ where: filter }),
    ]);
    return { jobs: data, total };
  } catch (error) {
    throw new Error('Unexpected error - selectSubsDataCv ' + error);
  }
};
