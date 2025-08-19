import dotenv from "dotenv";

dotenv.config();

export const config = {
    server: {
        port: process.env.PORT ?? 3000,
        env: process.env.NODE_ENV ?? "DEV"
    },
    psn: {
        accountId: process.env.ACCOUNT_ID
    },
    xbox: {
        username: process.env.XBOX_USERNAME,
        password: process.env.XBOX_PASSWORD
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
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
        apiKey: process.env.CLOUDINARY_API_KEY!,
        apiSecret: process.env.CLOUDINARY_API_SECRET!
    },
    logging: {
        level: process.env.LOG_LEVEL ?? "info"
    }
} as const;

export type Config = typeof config;
