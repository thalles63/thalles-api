import dotenv from "dotenv";

dotenv.config();

export const FinanceiroConfig = {
    frontend_url: process.env.FINANCEIRO_FRONTEND_URL,
    database: {
        dbUrl: process.env.FINANCEIRO_DATABASE_URL
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID
    }
} as const;

export type Config = typeof FinanceiroConfig;
