import dotenv from "dotenv";

dotenv.config();

export const FinanceiroConfig = {
    database: {
        dbUrl: process.env.FINANCEIRO_DATABASE_URL
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID
    }
} as const;

export type Config = typeof FinanceiroConfig;
