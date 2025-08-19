import { Request, Response } from "express";
import { Game } from "../../entities/games.entity";
import { CloudinaryService } from "../../services/external/cloudinary.service";
import { GameService } from "../../services/game.service";

export class UpdateIgdbInfoController {
    private readonly gameService: GameService;
    private readonly cloudinaryService: CloudinaryService;

    constructor() {
        this.gameService = new GameService();
        this.cloudinaryService = new CloudinaryService();
    }

    async update(req: Request, res: Response): Promise<void> {
        let updatedGame: Game;

        if (req.params.id) {
            updatedGame = (await this.gameService.editIgdbInfo(req.params.id, req.body.game))!;
        } else {
            updatedGame = await this.gameService.manualSave(req.body.game);
        }

        this.updateGameImagesAsync(updatedGame);
        res.json(updatedGame);
    }

    private updateGameImagesAsync(game: Game) {
        this.cloudinaryService
            .migrateGameImages(game)
            .then(async ({ game }) => {
                await this.gameService.editIgdbInfo(game.id, game);
            })
            .catch((err) => console.error("Erro ao migrar imagens:", err));
    }
}
