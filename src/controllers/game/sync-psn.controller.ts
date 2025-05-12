import { Request, Response } from "express";
import { Game } from "../../entities/games.entity";
import { AchievementService } from "../../services/achievement.service";
import { PlayStationService } from "../../services/external/playstation.service";
import { GameService } from "../../services/game.service";

export class SyncPsnGameController {
    private readonly gameService: GameService;
    private readonly playstationService: PlayStationService;
    private readonly achievementsService: AchievementService;

    constructor() {
        this.gameService = new GameService();
        this.playstationService = new PlayStationService();
        this.achievementsService = new AchievementService();
    }

    public async syncPsn(req: Request, res: Response): Promise<void> {
        const gamesSavedInApiIds = await this.getIdsOfGamesSavedInApi();
        const gamesFromPsn = await this.playstationService.getUserGames();
        const newGames = gamesFromPsn.filter((item) => !gamesSavedInApiIds.includes(item.igdbId ?? ""));

        for (const game of newGames) {
            game.platformId = await this.getNpCommunicationId(game);

            const savedGame = await this.gameService.saveFromWeb(game);

            if (savedGame?.platformId) {
                await this.achievementsService.saveFromPsn(savedGame);
            }
        }

        const gamesToUpdateAchievements = await this.getListOfGameIdsToUpdateAchievements();

        for (const game of gamesToUpdateAchievements) {
            const achievements = await this.playstationService.listAllEarnedByGame(game);

            await this.achievementsService.updateAchievements(achievements, game.id);

            const platinumAchievement = achievements.find((a) => a.type === "platinum");

            if (platinumAchievement) {
                game.isPlatinumed = true;
                game.isCampaignComplete = true;
                game.dateCompleted = platinumAchievement.dateAchieved!;
                this.gameService.edit(game.id, game);
            }
        }

        res.json({});
    }

    private async getIdsOfGamesSavedInApi() {
        return (await this.gameService.list(1, 300, true)).games.map((game) => game.igdbId);
    }

    private async getListOfGameIdsToUpdateAchievements() {
        return (await this.gameService.list(1, 300)).games.filter((game) => !game.isPlatinumed);
    }

    private async getNpCommunicationId(game: Partial<Game>) {
        return (await this.playstationService.getNpCommunicationId(<Game>game))?.titles[0]?.trophyTitles[0]?.npCommunicationId ?? "";
    }
}
