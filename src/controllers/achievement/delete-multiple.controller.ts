import { Request, Response } from "express";
import { AchievementService } from "../../services/achievement.service";

export class DeleteMultipleAchievementsController {
    private readonly achievementService: AchievementService;

    constructor() {
        this.achievementService = new AchievementService();
    }

    public async deleteMultiple(req: Request, res: Response): Promise<void> {
        const ids = req.body.ids;

        for (let id of ids) {
            await this.achievementService.delete(id);
        }

        res.json({ message: "Achievements successfully deleted" });
    }
}
