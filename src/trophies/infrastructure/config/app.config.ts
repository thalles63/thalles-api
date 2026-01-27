import dotenv from "dotenv";

dotenv.config();

export const TrophiesConfig = {
    database: {
        url: process.env.TROPHIES_DATABASE_URL
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
    }
} as const;

export type Config = typeof TrophiesConfig;
