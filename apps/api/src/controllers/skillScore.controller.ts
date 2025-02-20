import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';
import { Account } from '@/custom';
import { getSkillById } from '@/services/skillHandler';
import { getAllSQuestBySkill } from '@/services/skillQuestHandler';
import { getSubsDataByUser } from '@/services/subsDataHandler';
import { getSubsCatById } from '@/services/subsCtgHandler';
import { sScoreIdMaker } from '@/lib/customId';

export class SkillScoreController {
  async addSkillScore(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { skillId } = req.params;
      if (!skillId) throw new Error('Skill Id required');
      const { answers } = req.body;
      if (user.role !== 'user') {
        throw new Error('Unauthorized');
      }
      if (!Array.isArray(answers)) {
        throw new Error('Invalid request data');
      }
      const skill = await getSkillById(skillId);
      if (!skill) throw new Error("Skill doesn't exist");
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

      const subsData = await getSubsDataByUser(user.id);
      if (!subsData) {
        throw new Error(`No subscription data exist`);
      }
      const subsCtg = await getSubsCatById(subsData.subsCtgId);
      if (!subsCtg) throw new Error('No subscription category exist');

      let scoreData = null;
      const skillScoreId = await sScoreIdMaker();
      if (subsData.subsCtg.skillAssessment === true) {
        // Check subsCtg standard
        if (subsData.subsCtg.name === 'standard') {
          const assestTime = await prisma.skillScore.findMany({
            where: { subsDataId: subsData.id },
          });
          if (assestTime.length > 2) {
            throw new Error(
              'You have reach your assessment limit, please upgrade your subscription',
            );
          }
          // store to database
          scoreData = await prisma.skillScore.create({
            data: {
              id: skillScoreId,
              skillId: skill.id,
              subsDataId: subsData.id,
              score: correctCount,
            },
          });
        } else if (subsData.subsCtg.name === 'professional') {
          scoreData = await prisma.skillScore.create({
            data: {
              id: skillScoreId,
              skillId: skill.id,
              subsDataId: subsData.id,
              score: correctCount,
            },
          });
        } else {
          throw new Error('Invalid subsription category name!');
        }
      }
      return res.status(200).send({
        message: `Answer submitted successfully`,
        skillScore: scoreData,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSkillScore(req: Request, res: Response, next: NextFunction) {
    try {
      const { sScoreId } = req.params;
      if (!sScoreId) throw new Error(`Skill score id required`);
      const sScore = await prisma.skillScore.findUnique({
        where: { id: sScoreId },
      });
      if (!sScore) throw new Error(`Score data does't exist`);
      await prisma.skillScore.delete({
        where: { id: sScore.id },
      });
      return res.status(200).send({
        message: `Score data deleted successfully`,
        sScore,
      });
    } catch (error) {
      next(error);
    }
  }
}
