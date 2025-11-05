import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "./infrastructure/config/app.config";
import { AuthModule } from "./modules/auth/auth.module";
import { GamesModule } from "./modules/games/games.module";
import { PingModule } from "./modules/ping/ping.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            url: config.database.url,
            entities: ["src/domain/entities/**/*.ts"],
            synchronize: false,
            ssl: true
        }),
        PingModule,
        AuthModule,
        GamesModule
    ]
})
export class AppModule {}
