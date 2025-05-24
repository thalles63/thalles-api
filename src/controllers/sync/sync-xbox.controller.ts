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
            const gameToSave = structuredClone(game);
            gameToSave.lastTimePlayed = undefined;
            const savedGame = await this.gameService.saveFromWeb(gameToSave, true);

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

            const gameWithTimePlayed = gamesFromXboxLiveApi.find((g) => g.platformId === game.platformId);
            game.lastTimePlayed = gameWithTimePlayed?.lastTimePlayed;
            game.lastUnlock = gameWithTimePlayed?.lastTimePlayed;

            if (!achievements.length) {
                await this.gameService.edit(game.id, game);
                continue;
            }

            await this.achievementsService.updateAchievements(achievements, game.id);

            const mostRecent = achievements.reduce((newer: any, item: any) => {
                return new Date(item.dateAchieved) > new Date(newer.dateAchieved) ? item : newer;
            });
            const gamePontuation = achievements.reduce((sum, item) => sum + Number(item.type), 0);
            const is1000g = gamePontuation >= 1000;

            if (is1000g) {
                game.isCampaignComplete = true;
                game.isPlatinumed = true;
                game.status = 2;
                game.dateCompleted = mostRecent.dateAchieved!;
            }

            await this.gameService.edit(game.id, game);
        }

        res.json(gamesToUpdateAchievements);
    }

    private async getIdsOfGamesSavedInApi() {
        return (await this.gameService.list({ page: 1, limit: 300, order: {} }, { platform: PlatformEnum.Xbox }, true)).games.map((game) => game.platformId);
    }

    private async getListOfGameIdsToUpdateAchievements(gamesFromXbox: Partial<Game>[]) {
        const listOfGamesFromApi = (await this.gameService.list({ page: 1, limit: 300, order: {} }, { isPlatinumed: false, platform: PlatformEnum.Xbox }))
            .games;

        return listOfGamesFromApi.filter((game) => {
            const lastTimePlayed = gamesFromXbox.find((g) => g.platformId === game.platformId)!.lastTimePlayed;

            if (!lastTimePlayed) {
                return !!lastTimePlayed !== !!game.lastTimePlayed;
            }

            return new Date(lastTimePlayed).getTime() !== new Date(game.lastTimePlayed!).getTime();
        });
    }
}
