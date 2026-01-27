import dotenv from "dotenv";

dotenv.config();

export const GeneralConfig = {
    port: process.env.PORT ?? 3000,
    env: process.env.NODE_ENV ?? "DEV"
} as const;

export type Config = typeof GeneralConfig;
