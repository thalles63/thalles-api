import { Body, Controller, HttpCode, Post, Query } from "@nestjs/common";
import { PagamentoService } from "./pagamento.service";

@Controller("pagamento")
export class PagamentoController {
    constructor(private readonly paymentService: PagamentoService) {}

    @Post("create")
    async create(@Body() body: any) {
        return this.paymentService.createCheckout(body.idInscricao);
    }

    @Post("webhook")
    @HttpCode(200)
    async webhook(@Body() body: any, @Query() query: any) {
        const id = query["data.id"] || query.id || body?.data?.id;
        const topic = query.type || body?.type;

        console.log(id);
        console.log(topic);
        if (id) {
            this.paymentService.handleWebhook(id, topic);
        }

        return { status: "OK" };
    }
}
