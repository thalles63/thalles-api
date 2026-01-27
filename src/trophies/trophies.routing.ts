import { AuthModule } from "./modules/auth/auth.module";
import { BacklogScheduleModule } from "./modules/backlog-schedule/backlog-schedule.module";
import { AchievementsModule } from "./modules/games/achievements/achievements.module";
import { GamesModule } from "./modules/games/games.module";
import { PingModule } from "./modules/ping/ping.module";
import { TrophiesModule } from "./trophies.module";

export const TrophiesRouting = {
    path: "api/trophies",
    module: TrophiesModule,
    children: [
        {
            path: "/",
            module: GamesModule
        },
        {
            path: "/",
            module: AchievementsModule
        },
        {
            path: "/",
            module: PingModule
        },
        {
            path: "/",
            module: AuthModule
        },
        {
            path: "/",
            module: BacklogScheduleModule
        }
    ]
};
