import { Request, Response } from "express";
import { GameService } from "../../services/game.service";

export class DeleteGameController {
    private readonly gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    public async delete(req: Request, res: Response): Promise<void> {
        await this.gameService.softDelete(req.params.id);

        res.json({ message: "Game successfully deleted" });
    }
}
