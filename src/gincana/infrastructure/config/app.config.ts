import dotenv from "dotenv";

dotenv.config();

export const GincanaConfig = {
    logging: {
        level: process.env.LOG_LEVEL ?? "info"
    },
    database: {
        dbUrl: process.env.GINCANA_DATABASE_URL
    },
    evolutionAPI: {
        url: process.env.EVOLUTION_API_URL,
        apiKey: process.env.EVOLUTION_API_KEY,
        instanceName: process.env.EVOLUTION_API_INSTANCE
    },
    frontend_url: process.env.GINCANA_FRONTEND_URL,
    env: process.env.NODE_ENV,
    qrcodeHmacSecret: process.env.QRCODE_HMAC_SECRET ?? "default-gincana-secret-change-me"
} as const;

export type Config = typeof GincanaConfig;
