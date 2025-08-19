import { Request, Response } from "express";
import { AchievementService } from "../../services/achievement.service";
import { CloudinaryService } from "../../services/external/cloudinary.service";
import { GameService } from "../../services/game.service";

export class MigrateImagesFromGameController {
    private readonly cloudinaryService: CloudinaryService;
    private readonly gameService: GameService;
    private readonly achievementService: AchievementService;

    constructor() {
        this.cloudinaryService = new CloudinaryService();
        this.gameService = new GameService();
        this.achievementService = new AchievementService();
    }

    async migrate(req: Request, res: Response): Promise<void> {
        const games = await this.gameService.listAllWithAchievements();

        for (let oldGame of games) {
            const { game, achievements } = await this.cloudinaryService.migrateAllImages(oldGame);
            await this.gameService.edit(oldGame.id, game);
            if (achievements.length) {
                await this.achievementService.editMultiple(achievements);
            }
        }

        res.json({});
    }
}
