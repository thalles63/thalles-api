import { Request, Response } from "express";
import { GameService } from "../../services/game.service";

export class FindByIdGameController {
    private readonly gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    public async findById(req: Request, res: Response): Promise<void> {
        const game = await this.gameService.getById(req.params.id);

        if (game?.achievements?.length) {
            game.achievements = game.achievements.map((a) => {
                if (a?.dateAchieved?.toISOString() === "1970-01-01T00:00:00.000Z") {
                    a.dateAchieved = undefined!;
                }
                return a;
            });
        }

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
