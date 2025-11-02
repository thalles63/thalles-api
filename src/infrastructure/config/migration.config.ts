import { DataSource } from "typeorm";
import { config } from "./app.config";

export const migrationDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: ["src/domain/entities/**/*.ts"],
    migrations: ["src/infrastructure/migrations/**/*.ts"],
    migrationsTableName: "migrations",
    synchronize: false,
    logging: config.server.env === "DEV"
});
