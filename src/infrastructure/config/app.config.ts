import dotenv from "dotenv";

dotenv.config();

export const config = {
    server: {
        port: process.env.PORT ?? 3000,
        env: process.env.NODE_ENV ?? "DEV"
    },
    database: {
        url: process.env.DATABASE_URL
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
    logging: {
        level: process.env.LOG_LEVEL ?? "info"
    }
} as const;

export type Config = typeof config;
