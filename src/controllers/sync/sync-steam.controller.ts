import { Request, Response } from "express";
import { Achievement } from "../../entities/achievements.entity";
import { AchievementService } from "../../services/achievement.service";
import { SteamService } from "../../services/external/steam.service";
import { GameService } from "../../services/game.service";
import { PlatformEnum } from "../../utils/enums/platform.enum";

export class SyncSteamGameController {
    private readonly gameService: GameService;
    private readonly steamService: SteamService;
    private readonly achievementsService: AchievementService;

    constructor() {
        this.gameService = new GameService();
        this.steamService = new SteamService();
        this.achievementsService = new AchievementService();
    }

    async syncSteam(req: Request, res: Response): Promise<void> {
        const gamesSavedInApiIds = await this.getIdsOfGamesSavedInApi();
        const gamesFromSteam = await this.steamService.getUserGames();
        const newGames = gamesFromSteam.filter((item) => !gamesSavedInApiIds.includes(item.platformId?.toString() ?? ""));

        for (const game of newGames) {
            const savedGame = await this.gameService.saveFromWeb(game);
            if (savedGame) {
                await this.achievementsService.saveFromSteam(savedGame);
            }
        }

        const gamesToUpdateAchievements = await this.getListOfGameIdsToUpdateAchievements();

        for (const game of gamesToUpdateAchievements) {
            const achievements = (await this.steamService.getListOfAchievementsEarnedByGame(game))
                .filter((a) => a.isAchieved)
                .map((a) => {
                    return <Partial<Achievement>>{
                        isAchieved: true,
                        dateAchieved: new Date(Number(a.dateAchieved) * 1000),
                        platformId: a.platformId
                    };
                });

            await this.achievementsService.updateAchievements(achievements, game.id);

            const allAchievements = await this.steamService.getListOfAchievementsEarnedByGame(game);
            const is100Percent = allAchievements.every((a) => a.isAchieved);

            if (is100Percent) {
                const mostRecent = achievements.reduce((newer: any, item: any) => {
                    return new Date(item.dateAchieved) > new Date(newer.dateAchieved) ? item : newer;
                });

                game.isCampaignComplete = true;
                game.isPlatinumed = true;
                game.dateCompleted = mostRecent.dateAchieved!;
                await this.gameService.edit(game.id, game);
            }
        }

        res.json(gamesToUpdateAchievements);
    }

    private async getIdsOfGamesSavedInApi() {
        const games = await this.gameService.list(1, 300, { platform: PlatformEnum.Steam });
        return games.games.map((game) => game.platformId?.toString() ?? "");
    }

    private async getListOfGameIdsToUpdateAchievements() {
        return (await this.gameService.list(1, 300, { isPlatinumed: false, platform: PlatformEnum.Steam })).games;
    }
}
