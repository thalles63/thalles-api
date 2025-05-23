import { Request, Response } from "express";
import { AchievementService } from "../../services/achievement.service";

export class SaveMultipleAchievementsController {
    private readonly achievementService: AchievementService;

    constructor() {
        this.achievementService = new AchievementService();
    }

    async saveMultiple(req: Request, res: Response): Promise<void> {
        const achievements = req.body.achievements;
        const gameId = req.body.gameId;

        const savedAchievements = [];
        for (let achievement of achievements) {
            savedAchievements.push(await this.achievementService.manualSave(achievement, gameId));
        }

        res.json(savedAchievements);
    }
}
