import { DataSource } from "typeorm";
import { GeneralConfig } from "../../../shared/config/general.config";

export const migrationDataSource = new DataSource({
    type: "postgres",
    url: process.env.FINANCEIRO_DATABASE_URL,
    entities: ["src/financeiro/domain/entities/**/*.ts"],
    migrations: ["src/financeiro/infrastructure/migrations/**/*.ts"],
    migrationsTableName: "migrations",
    synchronize: false,
    logging: GeneralConfig.env === "DEV",
    ssl: true
});
