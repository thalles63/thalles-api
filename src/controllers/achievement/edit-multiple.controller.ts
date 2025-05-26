import { Request, Response } from "express";
import { AchievementService } from "../../services/achievement.service";

export class EditMultipleAchievementsController {
    private readonly achievementService: AchievementService;

    constructor() {
        this.achievementService = new AchievementService();
    }

    async editMultiple(req: Request, res: Response): Promise<void> {
        const achievements = req.body;

        const updatedAchievements = await this.achievementService.editMultiple(achievements);

        res.json(updatedAchievements);
    }
}
