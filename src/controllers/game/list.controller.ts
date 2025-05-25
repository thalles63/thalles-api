import { Request, Response } from "express";
import { In } from "typeorm";
import { GameService } from "../../services/game.service";
import { GameSort } from "../../utils/sorts/game.sort";

export class ListGameController {
    private readonly gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    public async list(req: Request, res: Response): Promise<void> {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const gameSorts: any = GameSort;
        const order = gameSorts[req.query.sort as string];
        const status = Number(req.query.status) === 5 ? [1, 2] : [Number(req.query.status)];
        const { games, total } = await this.gameService.list({ page, limit, order }, { status: In(status) });

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
