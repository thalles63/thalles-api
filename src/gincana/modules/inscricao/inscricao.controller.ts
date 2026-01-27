import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { InscricaoService } from "./inscricao.service";

@Controller("inscricoes")
export class InscricaoController {
    constructor(private readonly inscricaoService: InscricaoService) {}

    @Get(":cpf")
    async findByCpf(@Param("cpf") cpf: string) {
        return this.inscricaoService.findByCpf(cpf);
    }

    @Get("id/:id")
    async findById(@Param("id") id: string) {
        return this.inscricaoService.findById(id);
    }

    @Post()
    async create(@Body() dto: any) {
        return this.inscricaoService.create(dto);
    }
}
