import dotenv from "dotenv";

dotenv.config();

export const config = {
    server: {
        port: process.env.PORT ?? 3000,
        env: process.env.NODE_ENV ?? "DEV"
    },
    psn: {
        npssoToken: process.env.NPSSO_TOKEN,
        accountId: process.env.ACCOUNT_ID
    },
    igdb: {
        clientId: process.env.IGDB_CLIENT_ID,
        clientSecret: process.env.IGDB_CLIENT_SECRET
    },

    logging: {
        level: process.env.LOG_LEVEL ?? "info"
    }
} as const;

export type Config = typeof config;
