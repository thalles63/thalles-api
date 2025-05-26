import { Request, Response } from "express";
import { In } from "typeorm";
import { Game } from "../../entities/games.entity";
import { AchievementService } from "../../services/achievement.service";
import { PlayStationService } from "../../services/external/playstation.service";
import { GameService } from "../../services/game.service";
import { PlatformEnum } from "../../utils/enums/platform.enum";
import { StatusEnum } from "../../utils/enums/status.enum";

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

        const gamesToUpdateAchievements = await this.getListOfGameIdsToUpdateAchievements(gamesFromPsn);

        for (const game of gamesToUpdateAchievements) {
            const achievements = await this.playstationService.listAllEarnedByGame(game);
            const gameWithTimePlayed = gamesFromPsn.find((g) => g.psnId === game.psnId);

            game.lastTimePlayed = gameWithTimePlayed?.lastTimePlayed;
            game.timePlayed = gameWithTimePlayed?.timePlayed!;
            game.status = StatusEnum.Playing;

            if (!achievements.length) {
                await this.gameService.edit(game.id, game);
                continue;
            }

            await this.achievementsService.updateAchievements(achievements, game.id);

            const mostRecent = achievements
                .filter((a) => !!a.dateAchieved)
                .reduce((newer: any, item: any) => {
                    return new Date(item.dateAchieved).getTime() > new Date(newer.dateAchieved).getTime() ? item : newer;
                });

            game.lastUnlock = mostRecent.dateAchieved;

            const platinumAchievement = achievements.find((a) => a.type === "platinum");

            if (platinumAchievement) {
                game.isPlatinumed = true;
                game.isCampaignComplete = true;
                game.status = StatusEnum.Completed;
            }

            await this.gameService.edit(game.id, game);
        }

        res.json(gamesToUpdateAchievements);
    }

    private async getIdsOfGamesSavedInApi() {
        return (
            await this.gameService.list({ page: 1, limit: 300, order: {} }, { platform: In([PlatformEnum.Playstation4, PlatformEnum.Playstation5]) }, true)
        ).games.map((game) => game.igdbId);
    }

    private async getListOfGameIdsToUpdateAchievements(gamesFromPsn: Partial<Game>[]) {
        const listOfGamesFromApi = (
            await this.gameService.list(
                { page: 1, limit: 300, order: {} },
                { isPlatinumed: false, platform: In([PlatformEnum.Playstation4, PlatformEnum.Playstation5]) }
            )
        ).games;

        return listOfGamesFromApi.filter(
            (game) =>
                game.psnId && new Date(gamesFromPsn.find((g) => g.psnId === game.psnId)!.lastTimePlayed!).getTime() !== new Date(game.lastTimePlayed!).getTime()
        );
    }

    private async getNpCommunicationId(game: Partial<Game>) {
        return (await this.playstationService.getNpCommunicationId(<Game>game))?.titles[0]?.trophyTitles[0]?.npCommunicationId ?? "";
    }
}
