import { RouterModule } from "@nestjs/core";
import { GincanaRouting } from "./gincana/gincana.routing";
import { TrophiesRouting } from "./trophies/trophies.routing";

export const ApplicationRoutes = RouterModule.register([TrophiesRouting, GincanaRouting]);
