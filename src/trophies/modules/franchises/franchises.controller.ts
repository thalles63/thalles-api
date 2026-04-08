import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../infrastructure/guards/auth.guard";
import { FranchisesService } from "./franchises.service";

@Controller("franchises")
export class FranchisesController {
    constructor(private readonly franchisesService: FranchisesService) {}

    @Get("")
    public async list() {
        return this.franchisesService.list();
    }

    @Post("")
    @UseGuards(AuthGuard)
    public async create(@Body() body: { name: string }) {
        return this.franchisesService.create(body.name);
    }
}
