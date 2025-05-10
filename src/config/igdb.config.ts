import dotenv from "dotenv";

dotenv.config();

export const igdbConfig = {
    clientId: process.env.IGDB_CLIENT_ID,
    clientSecret: process.env.IGDB_CLIENT_SECRET
};
