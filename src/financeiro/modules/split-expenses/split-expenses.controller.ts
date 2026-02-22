import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SplitExpenseDTO } from "./dtos/split-expense.dto";
import { SplitExpensesService } from "./split-expenses.service";

@UseGuards(JwtAuthGuard)
@Controller("split-expenses")
export class SplitExpensesController {
    constructor(private readonly splitExpensesService: SplitExpensesService) {}

    @Get()
    async findByPeriod(@Query("month") month: string, @Query("year") year: string) {
        return this.splitExpensesService.findByPeriod(Number(month), Number(year));
    }

    @Get("month-status")
    async getMonthStatus(@Query("month") month: string, @Query("year") year: string) {
        return this.splitExpensesService.getMonthStatus(Number(month), Number(year));
    }

    @Post("month-status/close")
    async closeMonth(@Body() body: { month: number, year: number }, @Req() req: any) {
        return this.splitExpensesService.closeMonth(body.month, body.year, req.user.id);
    }

    @Post("month-status/reopen")
    async reopenMonth(@Body() body: { month: number, year: number }) {
        return this.splitExpensesService.reopenMonth(body.month, body.year);
    }

    @Post()
    async create(@Body() dto: SplitExpenseDTO) {
        return this.splitExpensesService.create(dto);
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: SplitExpenseDTO) {
        return this.splitExpensesService.update(id, dto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.splitExpensesService.remove(id);
    }

    @Get('metrics/monthly')
    async getMonthlyTotals(@Query('year') year: string) {
        if (!year) throw new BadRequestException('Ano é obrigatório (year)');
        return this.splitExpensesService.getMonthlyTotals(Number(year));
    }

    @Get('metrics/category')
    async getCategoryTotals(@Query('month') month: string, @Query('year') year: string) {
        if (!month || !year) throw new BadRequestException('Mês e Ano são obrigatórios (month, year)');
        return this.splitExpensesService.getCategoryTotals(Number(month), Number(year));
    }
}
