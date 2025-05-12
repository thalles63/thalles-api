import { Request, Response } from "express";
import { GameService } from "../../services/game.service";

export class SaveGameController {
    private readonly gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    async save(req: Request, res: Response): Promise<void> {
        const gameSaved = await this.gameService.manualSave(req.body);

        res.json(gameSaved);
    }
}
