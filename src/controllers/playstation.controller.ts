import { Request, Response } from "express";
import { PlayStationService } from "../services/playstation.service";

export class PlayStationController {
    private readonly playstationService: PlayStationService;

    constructor() {
        this.playstationService = new PlayStationService();
    }

    async getUserGames(req: Request, res: Response) {
        try {
            const games = await this.playstationService.getUserGames();
            return res.json(games);
        } catch (error) {
            console.error("Error in getUserGames:", error);
            return res.status(500).json({ error: "Failed to fetch games" });
        }
    }

    // async getGameAchievements(req: Request, res: Response) {
    //     try {
    //         const { accessToken, gameId } = req.body;

    //         if (!accessToken || !gameId) {
    //             return res.status(400).json({ error: "Access token and game ID are required" });
    //         }

    //         const achievements = await this.playstationService.getGameAchievements(accessToken, gameId);
    //         return res.json(achievements);
    //     } catch (error) {
    //         console.error("Error in getGameAchievements:", error);
    //         return res.status(500).json({ error: "Failed to fetch achievements" });
    //     }
    // }

    // async getUserProfile(req: Request, res: Response) {
    //     try {
    //         const { accessToken, username } = req.body;

    //         if (!accessToken || !username) {
    //             return res.status(400).json({ error: "Access token and username are required" });
    //         }

    //         const profile = await this.playstationService.getUserProfile(accessToken, username);
    //         return res.json(profile);
    //     } catch (error) {
    //         console.error("Error in getUserProfile:", error);
    //         return res.status(500).json({ error: "Failed to fetch user profile" });
    //     }
    // }
}
