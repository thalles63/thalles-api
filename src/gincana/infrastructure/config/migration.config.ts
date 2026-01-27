import { DataSource } from "typeorm";
import { GeneralConfig } from "../../../shared/config/general.config";

export const migrationDataSource = new DataSource({
    type: "postgres",
    url: process.env.GINCANA_DATABASE_URL,
    entities: ["src/gincana/domain/entities/**/*.ts"],
    migrations: ["src/gincana/infrastructure/migrations/**/*.ts"],
    migrationsTableName: "migrations",
    synchronize: false,
    logging: GeneralConfig.env === "DEV"
});
