import { Request, Response } from "express";
import { GameService } from "../services/game.service";
import { PlayStationService } from "../services/playstation.service";

export class GameController {
    private readonly gameService: GameService;
    private readonly playstationService: PlayStationService;

    constructor() {
        this.gameService = new GameService();
        this.playstationService = new PlayStationService();
    }

    async list(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const { games, total } = await this.gameService.list(page, limit);

            res.json({
                status: "success",
                data: {
                    games,
                    pagination: {
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit)
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Failed to fetch games"
            });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const game = await this.gameService.getById(req.params.id);

            if (!game) {
                res.status(404).json({
                    status: "error",
                    message: "Game not found"
                });
                return;
            }

            res.json({
                status: "success",
                data: game
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Failed to fetch game"
            });
        }
    }

    async syncPsnGames(req: Request, res: Response): Promise<void> {
        try {
            const gamesAlreadyOnApi = new Set((await this.gameService.list(1, 300)).games.map((game) => game.externalGameId));
            const gamesFromPsn = await this.playstationService.getUserGames();
            const newGamesToRegister = gamesFromPsn.filter((item) => !gamesAlreadyOnApi.has(item.externalGameId ?? ""));

            for (const game of newGamesToRegister) {
                await this.gameService.save(game);
            }

            res.json({
                status: "success",
                data: newGamesToRegister
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";

            if (errorMessage.includes("not found in IGDB")) {
                res.status(404).json({
                    status: "error",
                    message: errorMessage
                });
            } else {
                res.status(500).json({
                    status: "error",
                    message: "Failed to save game"
                });
            }
        }
    }
}
