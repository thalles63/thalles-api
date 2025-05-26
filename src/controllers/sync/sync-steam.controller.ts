import { Request, Response } from "express";
import { Achievement } from "../../entities/achievements.entity";
import { Game } from "../../entities/games.entity";
import { AchievementService } from "../../services/achievement.service";
import { SteamService } from "../../services/external/steam.service";
import { GameService } from "../../services/game.service";
import { PlatformEnum } from "../../utils/enums/platform.enum";
import { StatusEnum } from "../../utils/enums/status.enum";

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
            const gameToSave = structuredClone(game);
            gameToSave.timePlayed = 0;

            const savedGame = await this.gameService.saveFromWeb(gameToSave);
            if (savedGame) {
                await this.achievementsService.saveFromSteam(savedGame);
            }
        }

        const gamesToUpdateAchievements = await this.getListOfGameIdsToUpdateAchievements(gamesFromSteam);

        for (const game of gamesToUpdateAchievements) {
            let achievements = await this.steamService.getListOfAchievementsEarnedByGame(game);
            const gameWithTimePlayed = gamesFromSteam.find((g) => g.platformId === game.platformId);

            game.timePlayed = gameWithTimePlayed?.timePlayed!;
            game.lastTimePlayed = undefined;
            game.status = StatusEnum.Playing;

            if (!achievements?.length) {
                await this.gameService.edit(game.id, game);

                continue;
            }

            const is100Percent = achievements.every((a) => a.isAchieved);
            achievements = achievements
                .filter((a) => a.isAchieved)
                .map((a) => {
                    return <Achievement>{
                        isAchieved: true,
                        dateAchieved: new Date(Number(a.dateAchieved) * 1000),
                        platformId: a.platformId
                    };
                });

            if (!achievements?.length) {
                await this.gameService.edit(game.id, game);

                continue;
            }

            const mostRecent = achievements
                .filter((a) => !!a.dateAchieved)
                .reduce((newer: any, item: any) => {
                    return new Date(item.dateAchieved).getTime() > new Date(newer.dateAchieved).getTime() ? item : newer;
                });

            game.lastTimePlayed = mostRecent.dateAchieved!;
            game.lastUnlock = mostRecent.dateAchieved;

            await this.achievementsService.updateAchievements(achievements, game.id);

            if (is100Percent) {
                game.isCampaignComplete = true;
                game.isPlatinumed = true;
                game.status = StatusEnum.Completed;
            }

            await this.gameService.edit(game.id, game);
        }

        res.json(gamesToUpdateAchievements);
    }

    private async getIdsOfGamesSavedInApi() {
        const games = await this.gameService.list({ page: 1, limit: 300, order: {} }, { platform: PlatformEnum.Steam }, true);
        return games.games.map((game) => game.platformId?.toString() ?? "");
    }

    private async getListOfGameIdsToUpdateAchievements(gamesFromSteam: Partial<Game>[]) {
        const listOfGamesFromApi = (await this.gameService.list({ page: 1, limit: 300, order: {} }, { isPlatinumed: false, platform: PlatformEnum.Steam }))
            .games;

        return listOfGamesFromApi.filter(
            (game) => game.platformId && gamesFromSteam.find((g) => g.platformId === game.platformId)?.timePlayed !== game.timePlayed
        );
    }
}
