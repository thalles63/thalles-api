import { Request, Response } from "express";
import { ListFilters } from "../../interfaces/list-filters.interface";
import { GameService } from "../../services/game.service";

export class ListGameController {
    private readonly gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    public async list(req: Request, res: Response): Promise<void> {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const order = Number(req.query.sort);
        const status = Number(req.query.status);
        const filters = <ListFilters>{};

        if (status) {
            filters.status = status;
        }

        const { games, total } = await this.gameService.list({ page, limit, order }, filters);

        res.json({
            games,
            pagination: {
                page,
                limit,
                total,
                sort: Number(req.query.sort),
                pages: Math.ceil(total / limit)
            }
        });
    }
}
