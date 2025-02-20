import prisma from '@/prisma';
import { getSkillById } from './skillHandler';
import { sQuestIdMaker } from '@/lib/customId';
import { addCldQuestImage, delCldSQuestImage } from './cloudinary';

export const getSQuestById = async (sQuestId: string) => {
  try {
    const data = await prisma.skillQuestion.findUnique({
      where: { id: sQuestId },
    });
    if (!data) throw new Error("Question doesn't exist");
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - addSkillQuest ' + error);
  }
};

export const getAllSQuestBySkill = async (skillId: string) => {
  try {
    let data;
    data = await prisma.skillQuestion.findMany({
      where: { skillId },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const addSkillQuest = async (
  skillId: string,
  question: string,
  options: string[],
  answer: string,
  image?: Express.Multer.File,
) => {
  try {
    const findSkill = await getSkillById(skillId);
    if (!findSkill) throw new Error(`Skill doesn't exist`);
    const skillQuestId = await sQuestIdMaker();
    let cldImageUrl = null;
    if (image) {
      cldImageUrl = await addCldQuestImage(image, skillQuestId);
    }
    const data = await prisma.skillQuestion.create({
      data: {
        id: skillQuestId,
        skillId: findSkill.id,
        question,
        imageUrl: cldImageUrl,
        option_a: options[0],
        option_b: options[1],
        option_c: options[2],
        option_d: options[3],
        answer: answer,
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - addSkillQuest ' + error);
  }
};

export const delSkillQuest = async (sQuestId: string) => {
  try {
    const findSQuest = await getSQuestById(sQuestId);
    // delete cloudinary
    if (findSQuest.imageUrl) {
      try {
        await delCldSQuestImage(findSQuest.imageUrl);
      } catch (error: any) {
        throw new Error(
          'Failed to delete payment proof from Cloudinary:' + error.message,
        );
      }
    }
    const data = await prisma.skillQuestion.delete({
      where: { id: findSQuest.id },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - deleteSkillQuest ' + error);
  }
};

export const editSkillQuest = async (
  sQuestId: string,
  question?: string,
  options?: string[],
  answer?: string,
  image?: Express.Multer.File,
) => {
  try {
    const oldSkillQuest = await getSQuestById(sQuestId);
    if (!oldSkillQuest) throw new Error(`Question doesn't exist`);
    let newQuestion = oldSkillQuest.question;
    let newOption_a = oldSkillQuest.option_a;
    let newOption_b = oldSkillQuest.option_b;
    let newOption_c = oldSkillQuest.option_c;
    let newOption_d = oldSkillQuest.option_d;
    let newAnswer = oldSkillQuest.answer;
    let newImage = oldSkillQuest.imageUrl;
    let newOptions = [newOption_a, newOption_b, newOption_c, newOption_d];
    if (question) {
      newQuestion = question;
    }
    if (Array.isArray(options) && options.length === 4) {
      newOption_a = options[0];
      newOption_b = options[1];
      newOption_c = options[2];
      newOption_d = options[3];
      newOptions = [options[0], options[1], options[2], options[3]];
      if (!newOptions.includes(newAnswer)) {
        throw new Error('Correct answer must be one of the provided options');
      }
    } else
      throw new Error(
        'Each question must have a question, 4 options, and a correct answer',
      );
    if (answer) {
      newAnswer = answer;
      if (!newOptions.includes(newAnswer)) {
        throw new Error('Correct answer must be one of the provided options');
      }
    }
    if (image) {
      newImage = await addCldQuestImage(image, sQuestId);
    }
    const data = await prisma.skillQuestion.update({
      where: { id: sQuestId },
      data: {
        question: newQuestion,
        option_a: newOption_a,
        option_b: newOption_b,
        option_c: newOption_c,
        option_d: newOption_d,
        answer: newAnswer,
        imageUrl: newImage,
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error - editSkillQuest ' + error);
  }
};
