import { DataSource } from "typeorm";
import { config } from "./app.config";

export const migrationDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"],
    migrationsTableName: "migrations",
    synchronize: false,
    logging: config.server.env === "DEV"
});
