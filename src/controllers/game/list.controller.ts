import { Request, Response } from "express";
import { GameService } from "../../services/game.service";

export class ListGameController {
    private readonly gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    public async list(req: Request, res: Response): Promise<void> {
        const { page, limit, sort } = req.body;
        const filters = req.body;

        const { games, total } = await this.gameService.list({ page, limit, sort }, filters);

        res.json({
            games,
            pagination: {
                page,
                limit,
                total,
                sort,
                pages: Math.ceil(total / limit)
            }
        });
    }
}
