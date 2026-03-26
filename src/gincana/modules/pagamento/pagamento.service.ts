import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { ObterValoresPorDataNascimento } from "../../contracts/mappers/inscricao/findById.mapper";
import { Cupom } from "../../domain/entities/cupom.entity";
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
        @InjectRepository(Cupom, OrmConnectionEnum.Gincana) private readonly cupomRepo: Repository<Cupom>,
        @InjectRepository(Participante, OrmConnectionEnum.Gincana) private readonly particRepo: Repository<Participante>,
        private readonly whatsappService: WhatsappService
    ) {
        this.client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    }

    async createCheckout(inscricaoId: string, metodo: 'pix' | 'credit_card', cupomCodigo?: string) {
        const inscricao = await this.inscricaoRepo.findOne({ where: { id: inscricaoId }, relations: ["participantes", "participantes.participante"] });

        if (!inscricao) {
            return {};
        }

        let cupom: Cupom | null = null;
        let remainingUses = 0;
        if (cupomCodigo) {
            cupom = await this.cupomRepo.findOne({ where: { codigo: cupomCodigo.trim(), ativo: true } });
            if (cupom) {
                remainingUses = Math.max(0, cupom.limiteUsos - cupom.quantidadeUtilizada);
            }
        }

        let valorCobrado = 0;
        let excludedPaymentTypes = [];

        if (metodo === 'pix') {
            excludedPaymentTypes = [{ id: 'credit_card' }, { id: 'debit_card' }, { id: 'ticket' }];
        } else {
            excludedPaymentTypes = [{ id: 'ticket' }, { id: 'bank_transfer' }];
        }

        // Map participants to their raw prices and sort DESC to give max discount
        const parts = inscricao.participantes.map(ip => {
            const p = ip.participante;
            const priceObj = ObterValoresPorDataNascimento(p.dataNascimento);
            const price = metodo === 'pix' ? priceObj.pix : priceObj.cartao;
            return { p, price };
        });
        parts.sort((a, b) => b.price - a.price);

        // CLEAR any old coupon values to ensure idempotency if user dropped off previous MP checkouts
        for (const item of parts) {
            item.p.isPatrocinador = false;
            item.p.cupomUsado = null as any;
        }

        let usesToConsume = 0;
        for (const item of parts) {
            if (remainingUses > 0) {
                // Sponsor this specific participant
                item.p.isPatrocinador = true;
                item.p.cupomUsado = cupom!.codigo;
                remainingUses--;
                usesToConsume++;
            } else {
                valorCobrado += item.price;
            }
        }

        // Persist the participant tracking BEFORE redirecting
        for (const item of parts) {
            await this.particRepo.save(item.p);
        }

        if (valorCobrado === 0) {
            // Cart became 100% free with the partial/full coupon covers
            inscricao.ehPatrocinada = true;
            inscricao.dataPagamento = new Date();
            await this.inscricaoRepo.save(inscricao);

            // Se for totalmente grátis, aqui é o local definitivo de abater da base:
            if (cupom && usesToConsume > 0) {
                cupom.quantidadeUtilizada += usesToConsume;
                await this.cupomRepo.save(cupom);
            }

            const principalIp = inscricao.participantes.find((ip) => ip.tipo === TipoParticipante.Principal);
            const participantePrincipal = principalIp?.participante ?? <Participante>{};
            await this.whatsappService.sendLink("55" + participantePrincipal.telefone, inscricao.id);

            return { tipo: "free" };
        }

        let baseUrl = String(GincanaConfig.frontend_url).trim();

        const principalIp = inscricao.participantes.find((ip) => ip.tipo === TipoParticipante.Principal);
        const principalEmail = principalIp?.participante?.email ?? "pagador@inscricoesrevolucao.com.br";
        const principalNome = principalIp?.participante?.nome ?? "";
        const principalCpf = principalIp?.participante?.cpf ?? "";
        const [firstName, ...rest] = principalNome.split(" ");

        const itemTitle = "Inscrição na equipe revolução de " + inscricao.participantes.length + " participante(s)";

        if (metodo === 'pix') {
            const paymentClient = new Payment(this.client);
            const pixResult = await paymentClient.create({
                body: {
                    transaction_amount: valorCobrado,
                    description: itemTitle,
                    payment_method_id: "pix",
                    external_reference: inscricaoId,
                    notification_url: "https://api.inscricoesrevolucao.com.br/api/gincana/pagamento/webhook",
                    payer: {
                        email: principalEmail,
                        first_name: firstName || principalNome,
                        last_name: rest.join(" ") || undefined,
                        identification: principalCpf ? { type: "CPF", number: principalCpf.replace(/\D/g, "") } : undefined
                    }
                }
            });

            return {
                tipo: "pix",
                qrCode: pixResult.point_of_interaction?.transaction_data?.qr_code,
                qrCodeBase64: pixResult.point_of_interaction?.transaction_data?.qr_code_base64,
                paymentId: pixResult.id?.toString()
            };
        }

        // credit_card — Checkout Pro
        const preference = new Preference(this.client);
        const result = await preference.create({
            body: {
                external_reference: inscricaoId,
                payer: {
                    email: principalEmail,
                    name: firstName || principalNome,
                    surname: rest.join(" ") || undefined
                },
                items: [
                    {
                        id: inscricaoId,
                        title: itemTitle,
                        quantity: 1,
                        unit_price: valorCobrado
                    }
                ],
                payment_methods: {
                    excluded_payment_types: [{ id: 'ticket' }, { id: 'bank_transfer' }],
                    installments: 1
                },
                back_urls: {
                    success: baseUrl + "/pagamento/success",
                    failure: baseUrl + "/pagamento/failure",
                    pending: baseUrl + "/pagamento/pending"
                },
                binary_mode: true,
                ...(GincanaConfig.env === "PRD" && { auto_return: "all" }),
                notification_url: "https://api.inscricoesrevolucao.com.br/api/gincana/pagamento/webhook"
            }
        });

        return { tipo: "redirect", init_point: result.init_point };
    }

    async getStatus(inscricaoId: string): Promise<{ pago: boolean }> {
        const inscricao = await this.inscricaoRepo.findOne({ where: { id: inscricaoId } });
        return { pago: !!inscricao?.dataPagamento };
    }

    async handleWebhook(idMercadoPago: string, topic: string) {
        console.log(topic)
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

                const patrocinados = inscricao.participantes.filter(ip => ip.participante.isPatrocinador && !!ip.participante.cupomUsado);
                const couponsUsed = new Map<string, number>();
                patrocinados.forEach(ip => {
                    const code = ip.participante.cupomUsado as string;
                    couponsUsed.set(code, (couponsUsed.get(code) || 0) + 1);
                });

                for (const [code, count] of couponsUsed.entries()) {
                    const c = await this.cupomRepo.findOne({ where: { codigo: code } });
                    if (c) {
                        c.quantidadeUtilizada += count;
                        await this.cupomRepo.save(c);
                    }
                }

                const participantePrincipal = inscricao.participantes.find((p) => p.tipo === TipoParticipante.Principal)?.participante ?? <Participante>{};

                await this.whatsappService.sendLink("55" + participantePrincipal.telefone, inscricao.id);
            }
        }
    }
}
