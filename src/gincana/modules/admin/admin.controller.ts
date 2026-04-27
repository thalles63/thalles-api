import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Roles("admin")
    @Get("inscricoes")
    async listarInscricoes(
        @Query("anoEdicao") anoEdicao?: string,
        @Query("page") page?: string,
        @Query("pageSize") pageSize?: string,
        @Query("statusPagamento") statusPagamento?: string,
        @Query("incluirPatrocinadas") incluirPatrocinadas?: string
    ) {
        return this.adminService.listarInscricoes(
            anoEdicao ? Number(anoEdicao) : undefined,
            page ? Number(page) : 1,
            pageSize ? Number(pageSize) : 20,
            statusPagamento,
            incluirPatrocinadas === "true"
        );
    }

    @Put("inscricoes/:id/baixar")
    async confirmarRetirada(@Param("id") id: string) {
        return this.adminService.confirmarRetirada(id);
    }

    @Roles("admin")
    @Patch("config")
    async atualizarConfig(@Body() body: { inscricoesEncerradas: boolean }) {
        return this.adminService.atualizarConfig(body.inscricoesEncerradas);
    }

    @Roles("admin")
    @Post("inscricoes/:id/reenviar-whatsapp")
    async reenviarWhatsapp(@Param("id") id: string) {
        return this.adminService.reenviarWhatsapp(id);
    }
}
