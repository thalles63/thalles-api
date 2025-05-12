import { Request, Response } from "express";
import { GameService } from "../../services/game.service";

export class FindByIdGameController {
    private readonly gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    public async findById(req: Request, res: Response): Promise<void> {
        const game = await this.gameService.getById(req.params.id);

        if (!game) {
            res.status(404).json({
                status: "error",
                message: "Game not found"
            });
            return;
        }

        res.json(game);
    }
}
