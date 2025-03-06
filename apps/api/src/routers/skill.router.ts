import { SkillController } from '@/controllers/skill.controller';
import { SkillScoreController } from '@/controllers/skillScore.controller';
import { UserSkillController } from '@/controllers/userSkill.controller';
import {
  devGuard,
  userDevGuard,
  verifyToken,
} from '@/middlewares/auth.middleware';
import { uploadImage } from '@/middlewares/multer';
import {
  skillQuestValidation,
  updateSkillQuestValidation,
} from '@/middlewares/skillQuest.validation';
import { Router } from 'express';

export class SkillRouter {
  private router: Router;
  private skillController: SkillController;
  private skillScoreController: SkillScoreController;
  private userSkillController: UserSkillController;

  constructor() {
    this.skillController = new SkillController();
    this.skillScoreController = new SkillScoreController();
    this.userSkillController = new UserSkillController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All skill
    this.router.get('/all-skill', this.skillController.allSkill);

    // New Skill
    this.router.post(
      '/new',
      verifyToken,
      devGuard,
      this.skillController.newSkill,
    );

    // Delete Skill
    this.router.delete(
      '/delete/:skillId',
      verifyToken,
      devGuard,
      this.skillController.deleteSkill,
    );

    this.router.post(
      '/new-question/:skillId',
      verifyToken,
      devGuard,
      uploadImage,
      skillQuestValidation,
      this.skillController.newSkillQuest,
    );

    this.router.patch(
      '/edit-question/:sQuestId',
      verifyToken,
      devGuard,
      uploadImage,
      updateSkillQuestValidation,
      this.skillController.updateSkillQuest,
    );

    this.router.get(
      '/all-question/:skillId',
      this.skillController.allSkillQuestBySkill,
    );

    this.router.get(
      '/get-question/:sQuestId',
      verifyToken,
      devGuard,
      this.skillController.skillQuestById,
    );

    this.router.delete(
      '/delete-question/:sQuestId',
      verifyToken,
      devGuard,
      this.skillController.deleteSkillQuest,
    );

    this.router.post(
      '/submit-assestment/:uSkillId',
      verifyToken,
      userDevGuard,
      this.skillScoreController.newSkillScore,
    );
    this.router.delete(
      '/delete-score/:sScoreId',
      verifyToken,
      userDevGuard,
      this.skillScoreController.deleteSkillScore,
    );
    this.router.get(
      '/all-scores',
      verifyToken,
      devGuard,
      this.skillScoreController.allSkillScore,
    );
    this.router.get(
      '/user-scores/:uSkillId',
      verifyToken,
      this.skillScoreController.skillScoreByUserSkill,
    );

    this.router.post(
      '/user-skill/add',
      verifyToken,
      userDevGuard,
      this.userSkillController.newUserSkill,
    );
  }
  getRouter(): Router {
    return this.router;
  }
}
