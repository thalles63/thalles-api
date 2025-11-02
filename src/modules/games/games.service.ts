import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Raw, Repository, SelectQueryBuilder } from "typeorm";
import { ListGameMapper } from "../../contracts/mappers/list-game.mapper";
import { SaveGameMapper } from "../../contracts/mappers/save-game.mapper";
import type { GameSaveRequest } from "../../domain/dtos/game-save-request.dto";
import type { Achievement } from "../../domain/entities/achievements.entity";
import { Game } from "../../domain/entities/games.entity";
import { Genre } from "../../domain/entities/genre.entity";
import { Theme } from "../../domain/entities/theme.entity";
import type { GameListFilters } from "../../domain/interfaces/game-list-filters.interface";
import { GameSort } from "../../domain/sorts/game.sort";
import { AchievementsService } from "./achievements/achievements.service";

@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
        @InjectRepository(Theme) private readonly themeRepository: Repository<Theme>,
        @InjectRepository(Genre) private readonly genreRepository: Repository<Genre>,
        private readonly achievementsService: AchievementsService
    ) {}

    public async list(filters: GameListFilters) {
        const query = this.gameRepository
            .createQueryBuilder("games")
            .skip((filters.page - 1) * filters.limit)
            .take(filters.limit);

        this.applyFiltersToQuery(query, filters);
        this.applySortsToQuery(query, filters);

        const [games, total] = ListGameMapper(...(await query.getManyAndCount()));

        return { games, total };
    }

    public async countByStatus(filters: GameListFilters) {
        const query = this.gameRepository.createQueryBuilder("games").select("games.status", "status").addSelect("COUNT(*)", "total");

        delete filters.status;
        this.applyFiltersToQuery(query, filters);

        query.groupBy("games.status");

        return await query.getRawMany();
    }

    public async findById(gameId: string) {
        return await this.gameRepository
            .createQueryBuilder("game")
            .leftJoinAndSelect("game.achievements", "achievements")
            .leftJoinAndSelect("game.themes", "themes")
            .leftJoinAndSelect("game.genres", "genres")
            .where("game.id = :gameId", { gameId })
            .getOne();
    }

    public async save(gameRequest: GameSaveRequest) {
        try {
            if (!gameRequest.name) {
                throw new BadRequestException("Missing required field: name");
            }

            const newGame = await this.gameRepository.save(
                this.gameRepository.create(await SaveGameMapper(<Game>{}, gameRequest, this.genreRepository, this.themeRepository))
            );

            return newGame;
        } catch (error) {
            throw new BadRequestException(`Failed to save game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    public async edit(id: string, gameData: GameSaveRequest) {
        try {
            const game = await this.gameRepository.findOneBy({ id });

            if (!game) {
                throw new NotFoundException("Game not found");
            }

            const mostRecentAchievement: Achievement = await this.achievementsService.findMostRecentAchievedByGame(id);
            const gameToSave = await SaveGameMapper(game, gameData, this.genreRepository, this.themeRepository, mostRecentAchievement.dateAchieved);

            await this.gameRepository.save(gameToSave);

            return gameToSave;
        } catch (error) {
            throw new BadRequestException(`Failed to edit game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    public async softDelete(id: string) {
        try {
            const game = await this.gameRepository.findOneBy({ id });

            if (!game) {
                throw new NotFoundException("Game not found");
            }

            await this.gameRepository.softDelete(id);

            return true;
        } catch (error) {
            throw new BadRequestException(`Failed to delete game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    private applyFiltersToQuery(query: SelectQueryBuilder<Game>, filters: GameListFilters) {
        if (filters.status) {
            query.andWhere("games.status IN (:...statuses)", { statuses: Number(filters.status) === 5 ? [1, 2] : [Number(filters.status)] });
        }

        if (filters.name) {
            query.andWhere({ name: Raw((alias) => `LOWER(${alias}) Like '%${filters.name}%'`) });
        }

        if (filters.platform) {
            if (!Array.isArray(filters.platform)) {
                filters.platform = [filters.platform];
            }

            query.andWhere({ platform: In(filters.platform) });
        }

        if (filters.isCampaignComplete !== undefined) {
            query.andWhere("games.isCampaignComplete = :isCampaignComplete", { isCampaignComplete: filters.isCampaignComplete });
        }

        if (filters.isPlatinumed !== undefined) {
            query.andWhere("games.isPlatinumed = :isPlatinumed", { isPlatinumed: filters.isPlatinumed });
        }

        if (filters.rating) {
            query.andWhere("games.rating = :rating", { rating: filters.rating });
        }

        if (filters.releaseYear) {
            const year = Number(filters.releaseYear);
            const start = new Date(Date.UTC(year, 0, 1));
            const end = new Date(Date.UTC(year + 1, 0, 1));
            query.andWhere("games.releaseDate >= :start AND games.releaseDate < :end", { start, end });
        }

        if (filters.completionYear) {
            query
                .andWhere("EXTRACT(YEAR FROM games.lastTimePlayed) = :year", { year: filters.completionYear })
                .andWhere("games.isCampaignComplete = :isCampaignComplete", { isCampaignComplete: true });
        }
    }

    private applySortsToQuery(query: SelectQueryBuilder<Game>, filters: GameListFilters) {
        if (filters.sort) {
            query.addSelect("LOWER(games.name)", "games_name_lower");

            if (filters.sort === GameSort.Name) {
                query.orderBy("games_name_lower", "ASC");
            }

            if (filters.sort === GameSort.LastUnlock) {
                query.addOrderBy("games.lastTimePlayed", "DESC");
                query.addOrderBy("games_name_lower", "ASC");
            }

            if (filters.sort === GameSort.Rating) {
                query.orderBy("games.rating", "DESC");
                query.addOrderBy("games.lastTimePlayed", "DESC");
            }
        }
    }
}
