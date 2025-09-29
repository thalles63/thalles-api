import { Request, Response } from "express";
import { Achievement } from "../../entities/achievements.entity";
import { Game } from "../../entities/games.entity";
import { AchievementService } from "../../services/achievement.service";
import { CloudinaryService } from "../../services/external/cloudinary.service";

export class SaveFromSteamController {
    private readonly achievementService: AchievementService;
    private readonly cloudinaryService: CloudinaryService;

    constructor() {
        this.achievementService = new AchievementService();
        this.cloudinaryService = new CloudinaryService();
    }

    async save(req: Request, res: Response): Promise<void> {
        const game = req.body;

        const achievementsSaved = await this.achievementService.saveFromSteam(game);

        this.updateGameImagesAsync(game.id, achievementsSaved);
        res.json(achievementsSaved);
    }

    private updateGameImagesAsync(gameId: string, achievementsToSave: Achievement[]) {
        this.cloudinaryService
            .migrateAchievementImages(<Game>{ id: gameId, achievements: achievementsToSave })
            .then(({ achievements }) => {
                this.achievementService.updateAchievements(achievements, gameId);
            })
            .catch((err) => console.error("Erro ao migrar imagens:", err));
    }
}
