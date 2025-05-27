import { Request, Response } from "express";
import { IgdbService } from "../../services/external/igdb.service";

export class SearchIgdbController {
    private readonly igdbService: IgdbService;

    constructor() {
        this.igdbService = new IgdbService();
    }

    public async search(req: Request, res: Response): Promise<void> {
        const gameName = req.query.gameName;
        const games = await this.igdbService.searchGameByName(gameName!.toString());

        if (!games?.length) {
            res.status(404).json({
                status: "error",
                message: "Game not found"
            });
            return;
        }

        res.json(games);
    }
}
