import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { SplitExpenseMonth } from "../../domain/entities/split-expense-month.entity";
import { SplitExpense } from "../../domain/entities/split-expense.entity";
import { SplitExpenseDTO } from "./dtos/split-expense.dto";

@Injectable()
export class SplitExpensesService {
    constructor(
        @InjectRepository(SplitExpense, OrmConnectionEnum.Financeiro)
        private splitExpenseRepository: Repository<SplitExpense>,
        @InjectRepository(SplitExpenseMonth, OrmConnectionEnum.Financeiro)
        private splitExpenseMonthRepository: Repository<SplitExpenseMonth>
    ) {}

    async findByPeriod(month: number, year: number): Promise<SplitExpense[]> {
        const formattedMonth = month.toString().padStart(2, '0');
        const expenses = await this.splitExpenseRepository
            .createQueryBuilder("expense")
            .where("expense.date LIKE :date", { date: `${year}-${formattedMonth}-%` })
            .orderBy("expense.createdAt", "DESC")
            .getMany();

        return this.attachNames(expenses);
    }

    private async findOne(id: string): Promise<SplitExpense> {
        const expense = await this.splitExpenseRepository.findOne({ where: { id } });
        if (!expense) throw new NotFoundException(`SplitExpense with ID ${id} not found`);
        return (await this.attachNames([expense]))[0];
    }

    private async attachNames(expenses: SplitExpense[]): Promise<any[]> {
        if (!expenses.length) return [];
        
        // Fetch all unique user IDs involved
        const userIds = new Set<string>();
        expenses.forEach(e => {
            userIds.add(e.payerId);
            userIds.add(e.participantId);
        });

        // Fetch users from the same connection
        const users = await this.splitExpenseRepository.manager.query(
            `SELECT id, name FROM users WHERE id IN (${Array.from(userIds).map(id => `'${id}'`).join(',')})`
        );
        const nameMap = new Map<string, string>();
        users.forEach((u: any) => nameMap.set(u.id, u.name));

        return expenses.map(e => ({
            ...e,
            payerName: nameMap.get(e.payerId) || "Desconhecido",
            participantName: nameMap.get(e.participantId) || "Desconhecido"
        }));
    }

    async create(dto: SplitExpenseDTO): Promise<SplitExpense> {
        await this.checkIfMonthIsClosedBasedOnDate(dto.date);
        const expense = this.splitExpenseRepository.create(dto);
        const saved = await this.splitExpenseRepository.save(expense);
        return (await this.attachNames([saved]))[0];
    }

    async update(id: string, dto: SplitExpenseDTO): Promise<SplitExpense> {
        const expense = await this.splitExpenseRepository.findOne({ where: { id } });
        if (!expense) throw new NotFoundException(`SplitExpense with ID ${id} not found`);
        await this.checkIfMonthIsClosedBasedOnDate(expense.date);
        await this.checkIfMonthIsClosedBasedOnDate(dto.date); // In case they changed the date to another closed month
        const updated = this.splitExpenseRepository.merge(expense, dto);
        const saved = await this.splitExpenseRepository.save(updated);
        return (await this.attachNames([saved]))[0];
    }

    async remove(id: string): Promise<void> {
        const expense = await this.findOne(id);
        await this.checkIfMonthIsClosedBasedOnDate(expense.date);
        await this.splitExpenseRepository.remove(expense);
    }

    // --- Monthly Finalization Logic ---

    async getMonthStatus(month: number, year: number): Promise<{ isClosed: boolean }> {
        const status = await this.splitExpenseMonthRepository.findOne({ where: { month, year } });
        return { isClosed: status?.isClosed || false };
    }

    async closeMonth(month: number, year: number, userId: string): Promise<void> {
        let status = await this.splitExpenseMonthRepository.findOne({ where: { month, year } });
        if (!status) {
            status = this.splitExpenseMonthRepository.create({ month, year });
        }
        status.isClosed = true;
        status.closedByUserId = userId;
        status.closedAt = new Date();
        await this.splitExpenseMonthRepository.save(status);
    }

    async reopenMonth(month: number, year: number): Promise<void> {
        const status = await this.splitExpenseMonthRepository.findOne({ where: { month, year } });
        if (status) {
            status.isClosed = false;
            status.closedByUserId = null as any;
            status.closedAt = null as any;
            await this.splitExpenseMonthRepository.save(status);
        }
    }

    private async checkIfMonthIsClosedBasedOnDate(isoDateString: string): Promise<void> {
        const date = new Date(isoDateString);
        const month = date.getMonth() + 1; // getMonth() is 0-indexed
        const year = date.getFullYear();
        
        const status = await this.getMonthStatus(month, year);
        if (status.isClosed) {
            throw new BadRequestException(`Ações nesta despesa não são permitidas pois o mês ${month}/${year} já foi finalizado.`);
        }
    }

    async getMonthlyTotals(year: number): Promise<any[]> {
        // Build start/end ISO strings for the year
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31T23:59:59.999Z`;

        const expenses = await this.splitExpenseRepository.createQueryBuilder('expense')
            .where('expense.date >= :startDate', { startDate })
            .andWhere('expense.date <= :endDate', { endDate })
            .getMany();

        // Group by month
        const monthlyData = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: 0 }));

        expenses.forEach(e => {
            const date = new Date(e.date);
            const monthIndex = date.getMonth();
            const value = Number(e.totalValue);

            monthlyData[monthIndex].total += value;
        });

        return monthlyData;
    }

    async getCategoryTotals(month: number, year: number): Promise<any[]> {
        const startDate = new Date(year, month - 1, 1).toISOString();
        const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

        const expenses = await this.splitExpenseRepository.createQueryBuilder('expense')
            .where('expense.date >= :startDate', { startDate })
            .andWhere('expense.date <= :endDate', { endDate })
            .getMany();

        const categoryMap = new Map<string, number>();

        expenses.forEach(e => {
            const cat = e.categoryId || 'outros';
            const value = Number(e.totalValue);

            const current = categoryMap.get(cat) || 0;
            categoryMap.set(cat, current + value);
        });

        return Array.from(categoryMap.entries()).map(([categoryId, total]) => ({ categoryId, total }));
    }
}
