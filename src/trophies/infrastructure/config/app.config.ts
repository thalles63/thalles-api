import dotenv from "dotenv";

dotenv.config();

export const TrophiesConfig = {
    nodeEnv: process.env.NODE_ENV ?? "DEV",
    database: {
        url: process.env.TROPHIES_DATABASE_URL
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    },
    steam: {
        apiKey: process.env.STEAM_API_KEY,
        steamId: process.env.STEAM_ID
    },
    igdb: {
        clientId: process.env.IGDB_CLIENT_ID,
        clientSecret: process.env.IGDB_CLIENT_SECRET
    },
    scrapper: {
        key: process.env.SCRAPER_API_KEY
    },
    retroAchievements: {
        username: process.env.RA_USERNAME,
        apiKey: process.env.RA_API_KEY
    },
    itad: {
        apiKey: process.env.ITAD_API_KEY
    },
    logging: {
        level: process.env.LOG_LEVEL ?? "info"
    },
    gemini: {
        apiKey: process.env.GEMINI_API_KEY
    },
    rawg: {
        apiKey: process.env.RAWG_API_KEY
    },
    frontend_url: process.env.TROPHIES_FRONTEND_URL
} as const;

export type Config = typeof TrophiesConfig;
