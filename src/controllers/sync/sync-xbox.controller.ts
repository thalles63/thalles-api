import { Request, Response } from "express";
import { Achievement } from "../../entities/achievements.entity";
import { Game } from "../../entities/games.entity";
import { XboxAchievement } from "../../interfaces/xbox-achievement.interface";
import { AchievementService } from "../../services/achievement.service";
import { XboxService } from "../../services/external/xbox.service";
import { GameService } from "../../services/game.service";
import { PlatformEnum } from "../../utils/enums/platform.enum";

export class SyncXboxGameController {
    private readonly gameService: GameService;
    private readonly xboxService: XboxService;
    private readonly achievementsService: AchievementService;

    constructor() {
        this.gameService = new GameService();
        this.xboxService = new XboxService();
        this.achievementsService = new AchievementService();
    }

    async syncXbox(req: Request, res: Response): Promise<void> {
        const gamesSavedInApiIds = await this.getIdsOfGamesSavedInApi();
        const gamesFromXboxLiveApi = await this.xboxService.getUserGames();
        const newGames = gamesFromXboxLiveApi.filter((item) => !gamesSavedInApiIds.includes(item.platformId?.toString() ?? ""));

        for (const game of newGames) {
            const savedGame = await this.gameService.saveFromWeb(game, true);

            await this.achievementsService.saveFromXbox(savedGame!);
        }

        const gamesToUpdateAchievements = await this.getListOfGameIdsToUpdateAchievements(gamesFromXboxLiveApi);

        for (const game of gamesToUpdateAchievements) {
            const achievements = (await this.xboxService.getListOfAchievements(game))
                .filter((a) => a.progressState === "Achieved")
                .map((a: XboxAchievement) => {
                    return <Partial<Achievement>>{
                        isAchieved: true,
                        dateAchieved: a.progression.timeUnlocked,
                        platformId: a.id,
                        type: a.rewards[0]?.value ?? 0
                    };
                });

            if (!achievements.length) {
                continue;
            }

            await this.achievementsService.updateAchievements(achievements, game.id);

            const is1000g = achievements.reduce((sum, item) => sum + Number(item.type), 0) >= 1000;
            const mostRecent = achievements.reduce((newer: any, item: any) => {
                return new Date(item.dateAchieved) > new Date(newer.dateAchieved) ? item : newer;
            });

            if (is1000g) {
                game.isCampaignComplete = true;
                game.isPlatinumed = true;
                game.status = 2;
                game.dateCompleted = mostRecent.dateAchieved!;
            }

            game.lastUnlock = mostRecent.dateAchieved!;
            await this.gameService.edit(game.id, game);
        }

        res.json(newGames);
    }

    private async getIdsOfGamesSavedInApi() {
        return (await this.gameService.list(1, 300, { platform: PlatformEnum.Xbox }, true)).games.map((game) => game.platformId);
    }

    private async getListOfGameIdsToUpdateAchievements(gamesFromXbox: Partial<Game>[]) {
        const listOfGamesFromApi = (await this.gameService.list(1, 300, { isPlatinumed: false, platform: PlatformEnum.Xbox })).games;

        return listOfGamesFromApi.filter(
            (game) => new Date(gamesFromXbox.find((g) => g.platformId === game.platformId)!.lastUnlock!).getTime() !== new Date(game.lastUnlock).getTime()
        );
    }
}
