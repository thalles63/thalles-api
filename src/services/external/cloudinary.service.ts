import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";
import { config } from "../../config/app.config";
import { Game } from "../../entities/games.entity";

export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: config.cloudinary.cloudName,
            api_key: config.cloudinary.apiKey,
            api_secret: config.cloudinary.apiSecret
        });
    }

    async upload(imageUrl: string, imageName: string, folder: string): Promise<string | null> {
        try {
            const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

            return await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ folder, public_id: imageName }, (error: any, result: any) => {
                    if (error) reject(error);
                    else resolve(result?.secure_url ?? null);
                });
                uploadStream.end(response.data);
            });
        } catch (err: any) {
            console.error("Erro no upload:", err.message);
            return null;
        }
    }

    async migrateAllImages(game: Game) {
        if (game.image) {
            let newUrl = null;

            if (!game.image.includes("cloudinary")) {
                newUrl = await this.upload(game.image, game.id, "games/covers");
            }

            if (newUrl) {
                game.image = newUrl;
            }
        }

        if (game.screenshot) {
            let newUrl = null;

            if (!game.image.includes("cloudinary")) {
                newUrl = await this.upload(game.screenshot, game.id, "games/screenshots");
            }

            if (newUrl) {
                game.screenshot = newUrl;
            }
        }

        for (const achievement of game.achievements || []) {
            if (!achievement.image || achievement.image.includes("cloudinary")) continue;

            const newUrl = await this.upload(achievement.image, slugify(achievement.name), `achievements/${game.id}`);

            if (newUrl) {
                achievement.image = newUrl;
            }
        }

        return { game, achievements: game.achievements || [] };
    }

    async migrateGameImages(game: Game) {
        if (game.image) {
            const newUrl = await this.upload(game.image, game.id, "games/covers");

            if (newUrl) {
                game.image = newUrl;
            }
        }

        if (game.screenshot) {
            const newUrl = await this.upload(game.screenshot, game.id, "games/screenshots");

            if (newUrl) {
                game.screenshot = newUrl;
            }
        }

        return { game };
    }

    async migrateAchievementImages(game: Game) {
        for (const achievement of game.achievements || []) {
            if (!achievement.image) continue;

            const newUrl = await this.upload(achievement.image, slugify(achievement.name), `achievements/${game.id}`);

            if (newUrl) {
                achievement.image = newUrl;
            }
        }

        return { achievements: game.achievements || [] };
    }
}
