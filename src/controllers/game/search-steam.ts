import { Request, Response } from "express";
import { SteamService } from "../../services/external/steam.service";

export class SearchSteamController {
    private readonly steamService: SteamService;

    constructor() {
        this.steamService = new SteamService();
    }

    public async search(req: Request, res: Response): Promise<void> {
        const gameName = req.query.gameName;
        const games = await this.steamService.searchGameByName(gameName!.toString());

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
