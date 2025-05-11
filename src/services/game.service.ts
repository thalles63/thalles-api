import { Repository } from "typeorm";
import { appDataSource } from "../config/database.config";
import { Game } from "../entities/games.entity";
import { IgdbService } from "./igdb.service";

export class GameService {
    private readonly gameRepository: Repository<Game>;
    private readonly igdbService: IgdbService;

    constructor() {
        this.gameRepository = appDataSource.getRepository(Game);
        this.igdbService = new IgdbService();
    }

    async list(page: number = 1, limit: number = 10): Promise<{ games: Game[]; total: number }> {
        const [games, total] = await this.gameRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {
                name: "ASC"
            }
        });

        return { games, total };
    }

    async getById(id: string): Promise<Game | null> {
        return await this.gameRepository.findOneBy({ id });
    }

    async save(game: Partial<Game>) {
        try {
            const igdbGame = await this.igdbService.searchGameByExternalId(game.externalGameId!);

            if (!igdbGame) {
                return;
            }

            const newGame = this.gameRepository.create({
                name: igdbGame.name,
                image: igdbGame.image,
                screenshot: igdbGame.screenshot,
                externalGameId: game.externalGameId,
                platform: game.platform,
                rating: 0,
                timePlayed: game.timePlayed
            });

            return await this.gameRepository.save(newGame);
        } catch (error) {
            throw new Error(`Failed to save game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    // async updateGame(id: string, gameData: Partial<Game>): Promise<Game | null> {
    //     await this.gameRepository.update(id, gameData);
    //     return this.getGameById(id);
    // }

    // async deleteGame(id: string): Promise<boolean> {
    //     const result = await this.gameRepository.delete(id);
    //     return result.affected !== undefined && result.affected > 0;
    // }
}
