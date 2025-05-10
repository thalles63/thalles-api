import dotenv from "dotenv";

dotenv.config();

export const config = {
    server: {
        port: process.env.PORT ?? 3000,
        env: process.env.NODE_ENV ?? "DEV"
    },
    psn: {
        npsso: process.env.PSN_NPSSO
    },
    logging: {
        level: process.env.LOG_LEVEL ?? "info"
    }
} as const;

export type Config = typeof config;
