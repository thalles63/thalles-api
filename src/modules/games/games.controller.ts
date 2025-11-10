import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { FindByIdGameMapper } from "../../contracts/mappers/find-by-id-game.mapper";
import type { GameSaveRequest } from "../../domain/dtos/game-save-request.dto";
import { StatusEnum } from "../../domain/enums/status.enum";
import type { GameListFilters } from "../../domain/interfaces/game-list-filters.interface";
import { AuthGuard } from "../../infrastructure/guards/auth.guard";
import { IgdbService } from "./external-services/igdb.service";
import { SteamService } from "./external-services/steam.service";
import { GamesService } from "./games.service";

@Controller("api/games")
export class GamesController {
    constructor(
        private readonly gamesService: GamesService,
        private readonly igdbService: IgdbService,
        private readonly steamService: SteamService
    ) {}

    @Post("list")
    public async list(@Body() listFilters: GameListFilters) {
        const { games, total } = await this.gamesService.list(listFilters);

        return {
            games,
            pagination: {
                page: listFilters.page,
                limit: listFilters.limit,
                total: total,
                sort: listFilters.sort,
                pages: Math.ceil(total / listFilters.limit)
            }
        };
    }

    @Post("count")
    public async countByStatus(@Body() listFilters: GameListFilters) {
        const gamesTotal = await this.gamesService.countByStatus(listFilters);

        const statusMap: Record<number, keyof typeof counts> = {
            [StatusEnum.Playing]: "playing",
            [StatusEnum.Completed]: "completed",
            [StatusEnum.Backlog]: "backlog",
            [StatusEnum.Wishlist]: "wishlist"
        };

        const counts = { playing: 0, completed: 0, shelved: 0, backlog: 0, all: 0, wishlist: 0 };

        gamesTotal.forEach((row) => {
            const prop = statusMap[row.status];
            const total = Number(row.total);

            if (prop) counts[prop] = total;
            counts.all += total;
        });

        return counts;
    }

    @Get("searchIgdb")
    @UseGuards(AuthGuard)
    public async searchIgdb(@Query("gameName") gameName: string) {
        const games = await this.igdbService.searchGameByName(gameName);

        if (!games?.length) {
            throw new NotFoundException(`No games found with this name`);
        }

        return games;
    }

    @Get("searchSteam")
    @UseGuards(AuthGuard)
    public async searchSteam(@Query("gameName") gameName: string) {
        const games = await this.steamService.searchGameByName(gameName);

        if (!games?.length) {
            throw new NotFoundException(`No games found with this name`);
        }

        return games;
    }

    @Get(":id")
    public async findById(@Param("id") id: string) {
        const game = await this.gamesService.findById(id);

        if (!game) {
            throw new NotFoundException(`Game not found`);
        }

        return FindByIdGameMapper(game);
    }

    @Post("")
    @UseGuards(AuthGuard)
    public async save(@Body() gameRequest: GameSaveRequest) {
        const gameSaved = await this.gamesService.save(gameRequest);

        return gameSaved;
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    public async edit(@Param("id") id: string, @Body() gameRequest: GameSaveRequest) {
        const updatedGame = await this.gamesService.edit(id, gameRequest);

        return updatedGame;
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    public async delete(@Param("id") id: string) {
        await this.gamesService.softDelete(id);

        return true;
    }
}
