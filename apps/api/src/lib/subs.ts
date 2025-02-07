import prisma from '@/prisma';

const getSubsCategories = async () => {
  try {
    const datas = await prisma.subsCtg.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        cvGenerator: true,
        skillAssessment: true,
        priority: true,
      },
    });
    if (datas.length === 0) {
      return new Error('No data found');
    }
    return datas;
  } catch (error) {
    throw error;
  }
};

export { getSubsCategories };
