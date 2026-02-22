import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { SplitExpensesModule } from "./modules/split-expenses/split-expenses.module";

@Module({
    imports: [AuthModule, SplitExpensesModule]
})
export class FinanceiroModule {}
