import prisma from '@/prisma';
import { getSkillById } from './skillHandler';
import { getAllSQuestBySkill } from './skillQuestHandler';
import { getSubsDataById, getSubsDataByUser } from './subsDataHandler';
import { getSubsCatById } from './subsCtgHandler';
import { sScoreIdMaker } from '@/lib/customId';
import { getUserSkillById } from './userSkillHandler';
export const addSkillScore = async (
  userId: string,
  uSkillId: string,
  skillId: string,
  answers: any,
) => {
  try {
    const subsData = await getSubsDataByUser(userId);
    if (!subsData) {
      throw new Error(`No subscription data exist`);
    }
    if (
      subsData.isSubActive &&
      subsData.subsCtg.name !== 'standard' &&
      subsData.subsCtg.name !== 'professional'
    )
      throw new Error('Please update your subscription');

    const subsCtg = await getSubsCatById(subsData.subsCtgId);
    if (!subsCtg) throw new Error('No subscription category exist');

    let scoreData = null;
    if (!Array.isArray(answers)) {
      throw new Error('Invalid request data');
    }
    const skill = await getSkillById(skillId);
    if (!skill) throw new Error("Skill doesn't exist");

    const userSkill = await getUserSkillById(uSkillId);
    if (!userSkill) throw new Error(`User skill doesn't exist`);
    const sQuestions = await getAllSQuestBySkill(skill.id);
    if (!sQuestions)
      throw new Error(`No questions available for skill ${skill.name}`);
    // Check answer length and sQuestion length
    if (answers.length !== sQuestions.length) {
      throw new Error('Your answers is not complete');
    }
    //   Calculate score based on correct answer
    let correctCount = 0;
    answers.forEach((answer) => {
      const question = sQuestions.find((q) => q.id === answer.questionId);
      if (question && question.answer === answer.selectedAnswer) {
        correctCount++;
      }
    });

    const skillScoreId = await sScoreIdMaker();
    if (subsData.subsCtg.skillAssessment === true) {
      // Check subsCtg standard
      if (subsData.subsCtg.name === 'standard') {
        const assestTime = await prisma.skillScore.findMany({
          where: {
            userSkillId: {
              endsWith: `-${subsData.accountId}`,
            },
          },
        });
        console.log(assestTime);
        if (assestTime.length >= 2) {
          throw new Error(
            'You have reach your assessment limit, please upgrade your subscription',
          );
        }
        // store to database
        scoreData = await prisma.skillScore.create({
          data: {
            id: skillScoreId,
            userSkillId: userSkill.id,
            skillId: skill.id,
            score: correctCount,
          },
        });
      } else if (subsData.subsCtg.name === 'professional') {
        scoreData = await prisma.skillScore.create({
          data: {
            id: skillScoreId,
            userSkillId: userSkill.id,
            skillId: skill.id,
            score: correctCount,
          },
        });
      } else {
        throw new Error('Invalid subsription category name!');
      }
    }
    return scoreData;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('[addSkillScore] : Unexpected error ' + error);
  }
};

export const getSkillScoreById = async (sScoreId: string) => {
  try {
    const data = await prisma.skillScore.findUnique({
      where: { id: sScoreId },
      include: {
        userSkill: true,
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('[getSkillScoreById] : Unexpected error ' + error);
  }
};

export const getSkillScoreAll = async () => {
  try {
    const data = await prisma.skillScore.findMany();
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('[getSkillScoreAll] : Unexpected error ' + error);
  }
};

export const allSkillScoreByUserSkill = async (uSkillId: string) => {
  try {
    const userSkill = await getUserSkillById(uSkillId);
    if (!userSkill) throw new Error(`User skill doesn't exist`);
    const data = await prisma.skillScore.findMany({
      where: { userSkillId: userSkill.id },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('[getSkillScoreBySubsData] : Unexpected error ' + error);
  }
};

export const delSkillScore = async (userId: string, sScoreId: string) => {
  try {
    const subsData = await getSubsDataByUser(userId);
    if (!subsData) throw new Error(`Subscription data doesn't exist`);
    const sScore = await getSkillScoreById(sScoreId);
    if (!sScore) throw new Error(`Score data doesn't exist`);
    const userSkillIdsSet = new Set(
      subsData.userSkill.map((userSkill) => userSkill.id),
    );
    console.log(userSkillIdsSet);
    if (!userSkillIdsSet.has(sScore.userSkillId))
      throw new Error(`Unauthorized`);
    await prisma.skillScore.delete({
      where: { id: sScore.id },
    });
    return sScore;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('[delSkillScore] : Unexpected error ' + error);
  }
};
