import { Request, Response } from "express";
import { GameService } from "../services/game.service";

export class GameController {
    private readonly gameService: GameService;

    constructor() {
        this.gameService = new GameService();
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

    async save(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;

            if (!name) {
                res.status(400).json({
                    status: "error",
                    message: "Game name is required"
                });
                return;
            }

            const game = await this.gameService.save(name);

            res.status(201).json({
                status: "success",
                data: game
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
