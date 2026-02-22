import { RouterModule } from "@nestjs/core";
import { FinanceiroRouting } from "./financeiro/financeiro.routing";
import { GincanaRouting } from "./gincana/gincana.routing";
import { TrophiesRouting } from "./trophies/trophies.routing";

export const ApplicationRoutes = RouterModule.register([TrophiesRouting, GincanaRouting, FinanceiroRouting]);
