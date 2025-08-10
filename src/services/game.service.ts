import { In, Raw, Repository } from "typeorm";
import { appDataSource } from "../config/database.config";
import { Achievement } from "../entities/achievements.entity";
import { Game } from "../entities/games.entity";
import { Genre } from "../entities/genre.entity";
import { Theme } from "../entities/theme.entity";
import { ListFilters } from "../interfaces/list-filters.interface";
import { NotFoundError, ValidationError } from "../utils/errors/errors";
import { GameSort } from "../utils/sorts/game.sort";
import { IgdbService } from "./external/igdb.service";

export class GameService {
    private readonly gameRepository: Repository<Game>;
    private readonly igdbService: IgdbService;
    private readonly achievementRepository: Repository<Achievement>;
    private readonly genreRepository: Repository<Genre>;
    private readonly themeRepository: Repository<Theme>;

    constructor() {
        this.gameRepository = appDataSource.getRepository(Game);
        this.achievementRepository = appDataSource.getRepository(Achievement);
        this.genreRepository = appDataSource.getRepository(Genre);
        this.themeRepository = appDataSource.getRepository(Theme);

        this.igdbService = new IgdbService();
    }

    async list(pageOptions = { page: 1, limit: 10, sort: 2 }, where = <ListFilters>{}, includeDeleted: boolean = false) {
        const query = this.gameRepository
            .createQueryBuilder("games")
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .take(pageOptions.limit);

        if (where.status) {
            query.where({ status: In(Number(where.status) === 5 ? [1, 2] : [Number(where.status)]) });
        }

        if (where.name) {
            query.andWhere({ name: Raw((alias) => `LOWER(${alias}) Like '%${where.name}%'`) });
        }

        if (where.platform) {
            if (!Array.isArray(where.platform)) {
                where.platform = [where.platform];
            }

            query.andWhere({ platform: In(where.platform) });
        }

        if (where.retroConsole) {
            query.andWhere({ retroConsole: where.retroConsole });
        }

        if (where.isCampaignComplete !== undefined) {
            query.andWhere({ isCampaignComplete: where.isCampaignComplete });
        }

        if (where.isPlatinumed !== undefined) {
            query.andWhere({ isPlatinumed: where.isPlatinumed });
        }

        if (where.rating) {
            query.andWhere({ rating: where.rating });
        }

        if (where.releaseYear) {
            const year = Number(where.releaseYear);
            const start = new Date(Date.UTC(year, 0, 1));
            const end = new Date(Date.UTC(year + 1, 0, 1));
            query.andWhere("games.releaseDate >= :start AND games.releaseDate < :end", { start, end });
        }

        if (where.completionYear) {
            query
                .andWhere("EXTRACT(YEAR FROM games.lastUnlock) = :year", { year: where.completionYear })
                .andWhere("games.isCampaignComplete = :isCampaignComplete", { isCampaignComplete: true });
        }

        if (pageOptions.sort) {
            if (pageOptions.sort === GameSort.Name) {
                query.orderBy("LOWER(games.name)", "ASC");
            }

            if (pageOptions.sort === GameSort.LastUnlock) {
                query.orderBy("games.lastUnlock", "DESC");
                query.addOrderBy("LOWER(games.name)", "ASC");
            }

            if (pageOptions.sort === GameSort.Rating) {
                query.orderBy("games.rating", "DESC");
                query.addOrderBy("games.lastUnlock", "DESC");
            }
        }

        if (includeDeleted) {
            query.withDeleted();
        }

        const [games, total] = await query.getManyAndCount();

        return { games, total };
    }

    async getById(id: string): Promise<Game | null> {
        return await this.gameRepository.findOne({ where: { id }, relations: ["achievements", "themes", "genres"] });
    }

    async countByStatus(filter: ListFilters): Promise<any[] | null> {
        const qb = this.gameRepository.createQueryBuilder("game").select("game.status", "status").addSelect("COUNT(*)", "total");

        if (filter.name) {
            qb.andWhere("LOWER(game.name) LIKE LOWER(:name)", { name: filter.name });
        }

        if (filter.platform) {
            qb.andWhere("game.platform = :platform", { platform: filter.platform });
        }

        if (filter.retroConsole) {
            qb.andWhere("game.retroConsole = :retroConsole", { retroConsole: filter.retroConsole });
        }

        if (filter.isCampaignComplete !== undefined) {
            qb.andWhere("game.isCampaignComplete = :isCampaignComplete", { isCampaignComplete: filter.isCampaignComplete });
        }

        if (filter.isPlatinumed !== undefined) {
            qb.andWhere("game.isPlatinumed = :isPlatinumed", { isPlatinumed: filter.isPlatinumed });
        }

        if (filter.rating) {
            qb.andWhere("game.rating = :rating", { rating: filter.rating });
        }

        if (filter.releaseYear) {
            const year = Number(filter.releaseYear);
            const start = new Date(Date.UTC(year, 0, 1));
            const end = new Date(Date.UTC(year + 1, 0, 1));
            qb.andWhere("game.releaseDate >= :start AND game.releaseDate < :end", { start, end });
        }

        if (filter.completionYear) {
            qb.andWhere("EXTRACT(YEAR FROM game.lastUnlock) = :year", { year: filter.completionYear }).andWhere(
                "game.isCampaignComplete = :isCampaignComplete",
                { isCampaignComplete: true }
            );
        }

        qb.groupBy("game.status");

        const raw = await qb.getRawMany();
        return raw;
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

            const genres = await this.genreRepository.findBy({
                slug: In(igdbGame.genres?.map((genre) => genre.slug) || [])
            });

            const themes = await this.themeRepository.findBy({
                slug: In(igdbGame.themes?.map((theme) => theme.slug) || [])
            });

            const newGame = this.gameRepository.create({
                name: game.name,
                image: igdbGame.image ?? "",
                screenshot: igdbGame.screenshot ?? "",
                igdbId: game.igdbId,
                psnId: game.psnId,
                description: igdbGame.description,
                platformId: game.platformId,
                platform: game.platform,
                retroConsole: game.retroConsole,
                isPlatinumed: game.isPlatinumed || false,
                isCampaignComplete: game.isCampaignComplete || false,
                rating: 0,
                status: 1,
                timePlayed: 0,
                releaseDate: igdbGame.releaseDate,
                genres: genres,
                themes: themes,
                developer: igdbGame.developer,
                publisher: igdbGame.publisher
            });

            return await this.gameRepository.save(newGame);
        } catch (error) {
            throw new Error(`Failed to save game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async manualSave(game: Partial<any>) {
        try {
            if (!game.name || !game.image || !game.platform) {
                throw new ValidationError("Missing required fields: name, image, and platform are required");
            }

            const genres = await this.genreRepository.findBy({
                slug: In(game.genres || [])
            });

            const themes = await this.themeRepository.findBy({
                slug: In(game.themes || [])
            });

            const newGame = this.gameRepository.create({
                igdbId: game.igdbId ?? "",
                platformId: game.platformId ?? "",
                name: game.name,
                image: game.image,
                platform: game.platform,
                description: game.description,
                timePlayed: game.timePlayed ?? 0,
                isPlatinumed: game.isPlatinumed ?? false,
                isCampaignComplete: game.isCampaignComplete ?? false,
                screenshot: game.screenshot,
                isManualRegister: true,
                status: game.status,
                rating: game.rating ?? 0,
                releaseDate: game.releaseDate,
                genres: genres,
                themes: themes,
                developer: game.developer,
                publisher: game.publisher
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

            if (achievements?.length) {
                const mostRecent = achievements
                    .filter((a) => !!a.dateAchieved)
                    .reduce((newer: any, item: any) => {
                        return new Date(item.dateAchieved).getTime() > new Date(newer.dateAchieved).getTime() ? item : newer;
                    });

                gameData.lastUnlock = mostRecent.dateAchieved;

                if (gameData.isManualRegister) {
                    gameData.lastTimePlayed = mostRecent.dateAchieved;
                }
            }

            if (gameData.genres?.length) {
                const genres = await this.genreRepository.findBy({
                    slug: In(gameData.genres || [])
                });

                gameData.genres = genres;
            }

            if (gameData.themes?.length) {
                const themes = await this.themeRepository.findBy({
                    slug: In(gameData.themes || [])
                });

                gameData.themes = themes;
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
