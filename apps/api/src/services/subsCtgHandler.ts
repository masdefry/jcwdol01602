import { SubsCtgIdMaker } from '@/lib/customId';
import prisma from '@/prisma';

export const getCategories = async () => {
  try {
    let categories = null;
    categories = await prisma.subsCtg.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        cvGenerator: true,
        skillAssessment: true,
        priority: true,
      },
    });
    if (categories.length === 0) {
      return (categories = 'No data');
    }
    return categories;
  } catch (error) {
    throw error;
  }
};

export const getCategoryByName = async (name: string) => {
  try {
    const data = await prisma.subsCtg.findFirst({
      where: { name },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const data = await prisma.subsCtg.findUnique({
      where: { id },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const addCategory = async (
  name: string,
  price: number,
  cv: boolean,
  skill: boolean,
  priority: boolean,
) => {
  try {
    const customId = await SubsCtgIdMaker();
    const data = await prisma.subsCtg.create({
      data: {
        id: customId,
        name,
        price,
        cvGenerator: cv,
        skillAssessment: skill,
        priority,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    await prisma.subsCtg.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  name: string,
  price: number,
  cv: boolean,
  skill: boolean,
  priority: boolean,
) => {
  try {
    const data = await prisma.subsCtg.update({
      where: { id },
      data: {
        name,
        price,
        cvGenerator: cv,
        skillAssessment: skill,
        priority,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
