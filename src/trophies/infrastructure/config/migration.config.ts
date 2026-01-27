import { DataSource } from "typeorm";
import { GeneralConfig } from "../../../shared/config/general.config";

export const migrationDataSource = new DataSource({
    type: "postgres",
    url: process.env.TROPHIES_DATABASE_URL,
    entities: ["src/trophies/domain/entities/**/*.ts"],
    migrations: ["src/trophies/infrastructure/migrations/**/*.ts"],
    migrationsTableName: "migrations",
    synchronize: false,
    logging: GeneralConfig.env === "DEV"
});
