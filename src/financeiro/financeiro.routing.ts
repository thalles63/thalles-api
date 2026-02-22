import { FinanceiroModule } from "./financeiro.module";
import { AuthModule } from "./modules/auth/auth.module";
import { SplitExpensesModule } from "./modules/split-expenses/split-expenses.module";

export const FinanceiroRouting = {
    path: "financeiro",
    module: FinanceiroModule,
    children: [
        { path: "", module: AuthModule },
        { path: "", module: SplitExpensesModule }
    ]
};
