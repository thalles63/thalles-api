import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { CalculaValorParticipantes } from "../../contracts/mappers/inscricao/findById.mapper";
import { Inscricao } from "../../domain/entities/inscricao.entity";
import { Participante } from "../../domain/entities/participante.entity";
import { TipoParticipante } from "../../domain/enums/tipoParticipante.enum";
import { GincanaConfig } from "../../infrastructure/config/app.config";
import { WhatsappService } from "./whatsapp.service";

@Injectable()
export class PagamentoService {
    private readonly client: MercadoPagoConfig;

    constructor(
        @InjectRepository(Inscricao, OrmConnectionEnum.Gincana) private readonly inscricaoRepo: Repository<Inscricao>,
        private readonly whatsappService: WhatsappService
    ) {
        this.client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    }

    async createCheckout(inscricaoId: string) {
        const inscricao = await this.inscricaoRepo.findOne({ where: { id: inscricaoId }, relations: ["participantes", "participantes.participante"] });

        if (!inscricao) {
            return {};
        }

        const preference = new Preference(this.client);

        const result = await preference.create({
            body: {
                external_reference: inscricaoId,
                items: [
                    {
                        id: inscricaoId,
                        title: "Inscrição na equipe revolução de " + inscricao.participantes.length + " participante(s)",
                        quantity: 1,
                        unit_price: CalculaValorParticipantes(inscricao)
                    }
                ],
                back_urls: {
                    success: GincanaConfig.frontend.url + "/pagamento/success",
                    failure: GincanaConfig.frontend.url + "/pagamento/failure",
                    pending: GincanaConfig.frontend.url + "/pagamento/pending"
                },
                binary_mode: true,
                auto_return: "approved",
                notification_url: "https://2010ecb2990e.ngrok-free.app/api/pagamento/webhook"
            }
        });

        return { init_point: result.init_point };
    }

    async handleWebhook(idMercadoPago: string, topic: string) {
        if (topic !== "payment") return;

        const paymentClient = new Payment(this.client);
        const paymentData = await paymentClient.get({ id: idMercadoPago });

        if (!paymentData.id) {
            return;
        }

        if (paymentData.status === "approved") {
            const inscricaoId = paymentData.external_reference;
            const inscricao = await this.inscricaoRepo.findOne({ where: { id: inscricaoId }, relations: ["participantes", "participantes.participante"] });

            if (inscricao && !inscricao.dataPagamento) {
                inscricao.dataPagamento = new Date();
                inscricao.idMercadoPago = paymentData.id.toString();
                await this.inscricaoRepo.save(inscricao);

                const participantePrincipal = inscricao.participantes.find((p) => p.tipo === TipoParticipante.Principal)?.participante ?? <Participante>{};

                await this.whatsappService.sendLink("55" + participantePrincipal.telefone, inscricao.id);
            }
        }
    }
}
