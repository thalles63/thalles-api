import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { SplitExpenseMonth } from "../../domain/entities/split-expense-month.entity";
import { SplitExpense } from "../../domain/entities/split-expense.entity";
import { SplitExpensesController } from "./split-expenses.controller";
import { SplitExpensesService } from "./split-expenses.service";

@Module({
    imports: [TypeOrmModule.forFeature([SplitExpense, SplitExpenseMonth], OrmConnectionEnum.Financeiro)],
    controllers: [SplitExpensesController],
    providers: [SplitExpensesService]
})
export class SplitExpensesModule {}
