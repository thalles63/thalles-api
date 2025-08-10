import { Request, Response } from "express";
import { GameService } from "../../services/game.service";
import { StatusEnum } from "../../utils/enums/status.enum";

export class CountGamesByStatusController {
    private readonly gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    async count(req: Request, res: Response): Promise<void> {
        const filter = req.body;

        const gamesTotal = await this.gameService.countByStatus(filter);
        const statusMap: Record<number, keyof typeof counts> = {
            [StatusEnum.Playing]: "playing",
            [StatusEnum.Completed]: "completed",
            [StatusEnum.Shelved]: "shelved",
            [StatusEnum.Backlog]: "backlog"
        };

        const counts = { playing: 0, completed: 0, shelved: 0, backlog: 0, all: 0 };

        gamesTotal?.forEach((row) => {
            const prop = statusMap[row.status];
            const total = Number(row.total);

            if (prop) counts[prop] = total;
            counts.all += total;
        });

        res.json(counts);
    }
}
