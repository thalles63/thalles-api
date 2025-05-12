import { Request, Response } from "express";
import { GameService } from "../../services/game.service";

export class EditGameController {
    private readonly gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    async edit(req: Request, res: Response): Promise<void> {
        const updatedGame = await this.gameService.edit(req.params.id, req.body);

        res.json(updatedGame);
    }
}
