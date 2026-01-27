import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationRoutes } from "./app.routing";
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
        TrophiesModule,
        GincanaModule,
        ApplicationRoutes
    ]
})
export class AppModule {}
