import { Repository } from "typeorm";
import { appDataSource } from "../config/database.config";
import { Game } from "../entities/games.entity";

export class GameService {
    private readonly gameRepository: Repository<Game>;

    constructor() {
        this.gameRepository = appDataSource.getRepository(Game);
    }

    async listGames(page: number = 1, limit: number = 10): Promise<{ games: Game[]; total: number }> {
        const [games, total] = await this.gameRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {
                name: "ASC"
            }
        });

        return { games, total };
    }

    async getGameById(id: string): Promise<Game | null> {
        return await this.gameRepository.findOneBy({ id });
    }

    // async createGame(gameData: Partial<Game>): Promise<Game> {
    //     const game = this.gameRepository.create(gameData);
    //     return this.gameRepository.save(game);
    // }

    // async updateGame(id: string, gameData: Partial<Game>): Promise<Game | null> {
    //     await this.gameRepository.update(id, gameData);
    //     return this.getGameById(id);
    // }

    // async deleteGame(id: string): Promise<boolean> {
    //     const result = await this.gameRepository.delete(id);
    //     return result.affected !== undefined && result.affected > 0;
    // }
}
