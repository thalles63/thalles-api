import { Controller, Get, Param } from "@nestjs/common";
import { ParticipanteService } from "./participante.service";

@Controller("participantes")
export class ParticipanteController {
    constructor(private readonly participanteService: ParticipanteService) {}

    @Get(":cpf")
    async findByCpf(@Param("cpf") cpf: string) {
        return this.participanteService.findByCpf(cpf);
    }

    @Get(":cpf/status")
    async findStatusByCpf(@Param("cpf") cpf: string) {
        return this.participanteService.findStatusByCpf(cpf);
    }
}
