import { Request, Response } from "express";
import { Game } from "../../entities/games.entity";
import { ListFilters } from "../../interfaces/list-filters.interface";
import { AchievementService } from "../../services/achievement.service";
import { RetroAchievementsService } from "../../services/external/retro-achievements.service";
import { GameService } from "../../services/game.service";
import { PlatformEnum } from "../../utils/enums/platform.enum";
import { StatusEnum } from "../../utils/enums/status.enum";
import { GameSort } from "../../utils/sorts/game.sort";

export class SyncRetroAchievementsController {
    private readonly gameService: GameService;
    private readonly retroAchievementsService: RetroAchievementsService;
    private readonly achievementsService: AchievementService;

    constructor() {
        this.gameService = new GameService();
        this.retroAchievementsService = new RetroAchievementsService();
        this.achievementsService = new AchievementService();
    }

    public async syncRetroAchievements(req: Request, res: Response): Promise<void> {
        const gamesSavedInApiIds = await this.getIdsOfGamesSavedInApi();
        const gamesFromRetroAchievements = await this.retroAchievementsService.getUserGames();
        const newGames = gamesFromRetroAchievements.filter((item: Game) => !gamesSavedInApiIds.includes(item.platformId.toString() ?? ""));

        for (const game of newGames) {
            const savedGame = await this.gameService.saveFromWeb(game, true);

            if (savedGame?.platformId) {
                await this.achievementsService.saveFromRetroAchievements(savedGame);
            }
        }

        const gamesToUpdateAchievements = await this.getListOfGameIdsToUpdateAchievements(gamesFromRetroAchievements);

        for (const game of gamesToUpdateAchievements) {
            let achievements = await this.retroAchievementsService.listAllEarnedByGame(game);
            const gameWithTimePlayed = gamesFromRetroAchievements.find((g: Game) => g.platformId === game.platformId);

            game.lastTimePlayed = gameWithTimePlayed?.lastTimePlayed;
            game.timePlayed = gameWithTimePlayed?.timePlayed;
            game.status = StatusEnum.Playing;

            if (!achievements.length) {
                await this.gameService.edit(game.id, game);
                continue;
            }

            const is100Percent = achievements.every((a) => a.isAchieved);
            achievements = achievements.filter((a) => a.isAchieved);

            if (!achievements.length) {
                continue;
            }

            await this.achievementsService.updateAchievements(achievements, game.id);

            const mostRecent = achievements
                .filter((a) => !!a.dateAchieved)
                .reduce((newer: any, item: any) => {
                    return new Date(item.dateAchieved).getTime() > new Date(newer.dateAchieved).getTime() ? item : newer;
                });

            game.lastTimePlayed = mostRecent.dateAchieved;
            game.lastUnlock = mostRecent.dateAchieved;

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
        const filters = <ListFilters>{ platform: [PlatformEnum.RetroAchievements] };
        return (await this.gameService.list({ page: 1, limit: 300, sort: GameSort.Name }, filters, true)).games.map((game) => game.platformId);
    }

    private async getListOfGameIdsToUpdateAchievements(gamesFromRetroAchievements: Partial<Game>[]) {
        const filters = <ListFilters>{ isPlatinumed: false, platform: [PlatformEnum.RetroAchievements] };
        const listOfGamesFromApi = (await this.gameService.list({ page: 1, limit: 300, sort: GameSort.Name }, filters)).games;

        return listOfGamesFromApi.filter((game) => {
            return (
                game.platformId &&
                new Date(gamesFromRetroAchievements.find((g) => g.platformId === game.platformId)!.lastTimePlayed!).getTime() !==
                    new Date(game.lastTimePlayed!).getTime()
            );
        });
    }
}
