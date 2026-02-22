import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationRoutes } from "./app.routing";
import { FinanceiroModule } from "./financeiro/financeiro.module";
import { FinanceiroConfig } from "./financeiro/infrastructure/config/app.config";
import { GincanaModule } from "./gincana/gincana.module";
import { GincanaConfig } from "./gincana/infrastructure/config/app.config";
import { OrmConnectionEnum } from "./shared/enum/orm-connection.enum";
import { TrophiesConfig } from "./trophies/infrastructure/config/app.config";
import { TrophiesModule } from "./trophies/trophies.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            name: OrmConnectionEnum.Trophies,
            type: "postgres",
            url: TrophiesConfig.database.url,
            entities: ["src/trophies/domain/entities/**/*.ts"],
            synchronize: false,
            ssl: true
        }),
        TypeOrmModule.forRoot({
            name: OrmConnectionEnum.Gincana,
            type: "postgres",
            url: GincanaConfig.database.dbUrl,
            entities: ["src/gincana/domain/entities/**/*.ts"],
            synchronize: false,
            ssl: true
        }),
        TypeOrmModule.forRoot({
            name: OrmConnectionEnum.Financeiro,
            type: "postgres",
            url: FinanceiroConfig.database.dbUrl,
            entities: ["src/financeiro/domain/entities/**/*.ts"],
            synchronize: false,
            ssl: true
        }),
        TrophiesModule,
        GincanaModule,
        FinanceiroModule,
        ApplicationRoutes
    ]
})
export class AppModule {}
