import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CupomService } from "./cupom.service";

@Controller("cupons")
export class CupomController {
    constructor(private readonly cupomService: CupomService) {}

    @Get(":codigo/validate")
    async validate(@Param("codigo") codigo: string) {
        return this.cupomService.validate(codigo);
    }
}
