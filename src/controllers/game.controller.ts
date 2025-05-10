import { Request, Response } from "express";
import { GameService } from "../services/game.service";

export class GameController {
    private readonly gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    async listGames(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const { games, total } = await this.gameService.listGames(page, limit);

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

    async getGameById(req: Request, res: Response): Promise<void> {
        try {
            const game = await this.gameService.getGameById(req.params.id);

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
}
