import { Request, Response } from "express";
import { GameService } from "../../services/game.service";
import { StatusEnum } from "../../utils/enums/status.enum";

export class CountGamesByStatusController {
    private readonly gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    async count(req: Request, res: Response): Promise<void> {
        const playing = (await this.gameService.countByStatus(StatusEnum.Playing)) ?? 0;
        const backlog = (await this.gameService.countByStatus(StatusEnum.Backlog)) ?? 0;
        const completed = (await this.gameService.countByStatus(StatusEnum.Completed)) ?? 0;
        const shelved = (await this.gameService.countByStatus(StatusEnum.Shelved)) ?? 0;
        const all = playing + backlog + completed + shelved;

        res.json({ playing, backlog, completed, shelved, all });
    }
}
