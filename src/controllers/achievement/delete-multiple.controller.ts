import { Request, Response } from "express";
import { AchievementService } from "../../services/achievement.service";

export class DeleteMultipleAchievementsController {
    private readonly achievementService: AchievementService;

    constructor() {
        this.achievementService = new AchievementService();
    }

    public async deleteMultiple(req: Request, res: Response): Promise<void> {
        const ids = req.body.ids;

        const result = await this.achievementService.delete(ids);

        res.json({ message: "Achievements successfully deleted", result });
    }
}
