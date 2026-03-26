import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { PagamentoService } from "./pagamento.service";
import { WhatsappService } from "./whatsapp.service";

@Controller("pagamento")
export class PagamentoController {
    constructor(private readonly paymentService: PagamentoService, private readonly whatsappService: WhatsappService) {}

    @Post("create")
    async create(@Body() body: any) {
        return this.paymentService.createCheckout(body.idInscricao, body.metodo, body.cupomCodigo);
    }

    @Get("status/:inscricaoId")
    async status(@Param("inscricaoId") inscricaoId: string) {
        return this.paymentService.getStatus(inscricaoId);
    }

    @Post("webhook")
    @HttpCode(200)
    async webhook(@Body() body: any, @Query() query: any) {
        const id = query["data.id"] || query.id || body?.data?.id;
        const topic = query.type || body?.type;

        if (id) {
            this.paymentService.handleWebhook(id, topic);
        }

        return { status: "OK" };
    }

    @Get("test-whatsapp")
    async testWhatsapp(@Body() body: any) {
        await this.whatsappService.sendLink("5554991811871", "1");
        return { status: "OK" };
    }
}
