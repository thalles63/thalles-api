import { Request, Response } from "express";
import { GameService } from "../../services/game.service";

export class ListGameController {
    private readonly gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    public async list(req: Request, res: Response): Promise<void> {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { games, total } = await this.gameService.list(page, limit);

        res.json({
            games,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
}
