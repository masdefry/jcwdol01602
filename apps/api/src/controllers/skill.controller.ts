import { Account } from '@/custom';
import { skillIdMaker } from '@/lib/customId';
import prisma from '@/prisma';
import { delCldSQuestImage } from '@/services/cloudinary';
import { getSkillById } from '@/services/skillHandler';
import {
  addSkillQuest,
  delSkillQuest,
  editSkillQuest,
  getAllSQuestBySkill,
  getSQuestById,
} from '@/services/skillQuestHandler';
import { Request, Response, NextFunction } from 'express';

export class SkillController {
  async newSkill(req: Request, res: Response, next: NextFunction) {
    try {
      // get devId
      const dev = req.account as Account;
      const { skillName } = req.body;
      if (!skillName) throw new Error('Skill name required');
      // check if name already exist in skill db
      const findSkill = await prisma.skill.findFirst({
        where: { name: skillName },
      });
      if (findSkill) throw new Error('Skill already exist');
      // insert to db
      const skillId = await skillIdMaker();
      const skill = await prisma.skill.create({
        data: {
          id: skillId,
          name: skillName,
          createdById: dev.id,
        },
      });
      return res.status(201).send({
        message: 'New skill created successfully',
        skill,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const { skillId } = req.params;
      if (!skillId) throw new Error('Skill id required');
      const findSkill = await prisma.skill.findUnique({
        where: { id: skillId },
      });
      if (!findSkill) throw new Error("Skill doesn't exist");
      const sQuestData = await getAllSQuestBySkill(skillId);
      if (sQuestData.length > 0) {
        for (const quest of sQuestData) {
          if (quest.imageUrl) {
            await delCldSQuestImage(quest.imageUrl);
          }
        }
      }
      await prisma.skill.delete({
        where: { id: findSkill.id },
      });
      return res.status(200).send({
        message: 'Skill deleted successfully',
        data: findSkill,
      });
    } catch (error) {
      next(error);
    }
  }

  async allSkill(req: Request, res: Response, next: NextFunction) {
    try {
      let skills = null;
      skills = await prisma.skill.findMany();
      return res.status(200).send({
        message: 'All skill retrieved successfully',
        skills,
      });
    } catch (error) {
      next(error);
    }
  }

  async newSkillQuest(req: Request, res: Response, next: NextFunction) {
    try {
      const { skillId } = req.params;
      if (!skillId) throw new Error('Skill Id is required');
      const question: string = req.body.question;
      const options: string[] = JSON.parse(req.body.options);
      const answer: string = req.body.answer;
      const image = req.file;

      if (
        !question ||
        !options ||
        !Array.isArray(options) ||
        options.length !== 4 ||
        !answer
      ) {
        throw new Error(
          'Each question must have a question, 4 options, and a correct answer',
        );
      }
      if (!options.includes(answer)) {
        throw new Error('Correct answer must be one of the provided options');
      }

      // add to handler

      const skillQuest = await addSkillQuest(
        skillId,
        question,
        options,
        answer,
        image,
      );

      return res.status(201).send({
        message: 'Questions created successfully',
        skillQuest,
      });
    } catch (error) {
      next(error);
    }
  }

  async allSkillQuestBySkill(req: Request, res: Response, next: NextFunction) {
    try {
      const { skillId } = req.params;
      if (!skillId) throw new Error(`Skill id required`);
      const skill = await getSkillById(skillId);
      if (!skill) throw new Error(`Skill doesn't exist`);
      let allSkillQuest = null;
      allSkillQuest = await getAllSQuestBySkill(skill.id);
      if (allSkillQuest.length === null) {
        allSkillQuest = 'No data';
      }
      return res.status(200).send({
        message: `Skill questions by ${skill.name} skill retrieved successfully`,
        allSkillQuest,
      });
    } catch (error) {
      next(error);
    }
  }

  async skillQuestById(req: Request, res: Response, next: NextFunction) {
    try {
      const { sQuestId } = req.params;
      if (!sQuestId) throw new Error(`Skill question id required`);
      const question = await getSQuestById(sQuestId);
      return res.status(200).send({
        message: 'Question retrieved successfully',
        question,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteSkillQuest(req: Request, res: Response, next: NextFunction) {
    try {
      const { sQuestId } = req.params;

      if (!sQuestId) throw new Error(`Skill question id required`);
      const deleteData = await delSkillQuest(sQuestId);
      return res.status(200).send({
        message: `Question with id ${sQuestId} deleted successfully`,
        sQuest: deleteData,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateSkillQuest(req: Request, res: Response, next: NextFunction) {
    try {
      const { sQuestId } = req.params;
      if (!sQuestId) throw new Error('Skill question id required');
      const question: string = req.body.question;
      const options: string[] = JSON.parse(req.body.options);
      const answer: string = req.body.answer;
      const image = req.file;
      const updateQuest = await editSkillQuest(
        sQuestId,
        question,
        options,
        answer,
        image,
      );

      return res.status(200).send({
        message: 'Question updated successfully',
        skillQuest: updateQuest,
      });
    } catch (error) {
      next(error);
    }
  }
}
