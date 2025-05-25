import { Repository } from "typeorm";
import { appDataSource } from "../config/database.config";
import { Achievement } from "../entities/achievements.entity";
import { Game } from "../entities/games.entity";
import { NotFoundError, ValidationError } from "../utils/errors/errors";
import { IgdbService } from "./external/igdb.service";

export class GameService {
    private readonly gameRepository: Repository<Game>;
    private readonly igdbService: IgdbService;
    private readonly achievementRepository: Repository<Achievement>;

    constructor() {
        this.gameRepository = appDataSource.getRepository(Game);
        this.achievementRepository = appDataSource.getRepository(Achievement);
        this.igdbService = new IgdbService();
    }

    async list(pageOptions = { page: 1, limit: 10, order: {} }, where: any = {}, includeDeleted: boolean = false): Promise<{ games: Game[]; total: number }> {
        const [games, total] = await this.gameRepository.findAndCount({
            where,
            skip: (pageOptions.page - 1) * pageOptions.limit,
            take: pageOptions.limit,
            order: pageOptions.order,
            withDeleted: includeDeleted
        });

        return { games, total };
    }

    async getById(id: string): Promise<Game | null> {
        return await this.gameRepository.findOne({ where: { id }, relations: ["achievements"] });
    }

    async saveFromWeb(game: Partial<Game>, skipIgdb = false) {
        try {
            let igdbGame: Partial<Game> | null = {};

            if (!skipIgdb) {
                try {
                    igdbGame = await this.igdbService.searchGameByExternalId(game.igdbId!);

                    igdbGame ??= {};
                } catch {
                    igdbGame ??= {};
                }
            }

            const newGame = this.gameRepository.create({
                name: game.name,
                image: igdbGame.image ?? "",
                screenshot: igdbGame.screenshot ?? "",
                igdbId: game.igdbId,
                psnId: game.psnId,
                description: igdbGame.description,
                platformId: game.platformId,
                platform: game.platform,
                dateCompleted: game.dateCompleted,
                isPlatinumed: game.isPlatinumed || false,
                isCampaignComplete: game.isCampaignComplete || false,
                rating: 0,
                status: 1,
                timePlayed: 0
            });

            return await this.gameRepository.save(newGame);
        } catch (error) {
            throw new Error(`Failed to save game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async manualSave(game: Partial<Game>) {
        try {
            if (!game.name || !game.image || !game.platform) {
                throw new ValidationError("Missing required fields: name, image, and platform are required");
            }

            const newGame = this.gameRepository.create({
                igdbId: game.igdbId ?? "",
                platformId: game.platformId ?? "",
                name: game.name,
                image: game.image,
                platform: game.platform,
                description: game.description,
                timePlayed: game.timePlayed ?? 0,
                isPlatinumed: game.isPlatinumed ?? false,
                dateCompleted: game.dateCompleted,
                isCampaignComplete: game.isCampaignComplete ?? false,
                screenshot: game.screenshot,
                isManualRegister: true,
                status: game.status,
                rating: game.rating ?? 0
            });

            return await this.gameRepository.save(newGame);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new Error(`Failed to save game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async softDelete(id: string): Promise<boolean> {
        try {
            const game = await this.gameRepository.findOneBy({ id });

            if (!game) {
                throw new NotFoundError("Game not found");
            }

            await this.gameRepository.softDelete(id);
            return true;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new Error(`Failed to soft delete game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async edit(id: string, gameData: Partial<Game>): Promise<Game | null> {
        try {
            const game = await this.gameRepository.findOneBy({ id });

            if (!game) {
                throw new NotFoundError("Game not found");
            }

            const achievements = await this.achievementRepository.find({
                where: { gameId: id, isAchieved: true }
            });

            if (gameData.isManualRegister && achievements?.length) {
                const mostRecent = achievements.reduce((newer: any, item: any) => {
                    return new Date(item.dateAchieved).getTime() > new Date(newer.dateAchieved).getTime() ? item : newer;
                });

                gameData.lastTimePlayed = mostRecent.dateAchieved;
                gameData.lastUnlock = mostRecent.dateAchieved;
            }

            gameData.timePlayed ??= 0;

            Object.assign(game, gameData);
            return await this.gameRepository.save(game);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new Error(`Failed to edit game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
}
