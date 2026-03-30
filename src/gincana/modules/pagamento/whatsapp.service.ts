import { Injectable } from "@nestjs/common";
import axios from "axios";
import crypto from "crypto";
import { GincanaConfig } from "../../infrastructure/config/app.config";

@Injectable()
export class WhatsappService {
    /**
     * Gera um token HMAC-SHA256 a partir do ID da inscrição.
     * Esse token garante que o QR Code foi gerado pelo nosso backend.
     */
    generateQrcodeToken(inscricaoId: string): string {
        return crypto.createHmac("sha256", GincanaConfig.qrcodeHmacSecret).update(inscricaoId).digest("hex");
    }

    async sendLink(phone: string, inscricaoId: string, nomeParticipante: string, qtdParticipantes: number) {
        try {
            const cleanPhone = phone.replace(/\D/g, "");
            const firstName = nomeParticipante.split(" ")[0] || "participante";
            const idCurto = inscricaoId.slice(-8).toUpperCase();

            const token = this.generateQrcodeToken(inscricaoId);
            const baseUrl = String(GincanaConfig.frontend_url).trim().replace(/\/$/, "");
            const qrcodeLink = `${baseUrl}/qrcode/${inscricaoId}?token=${token}`;

            const message =
                `🎉 *Pagamento confirmado!*\n\n` +
                `Olá, ${firstName}! Recebemos o pagamento da sua inscrição na *Equipe Revolução* com sucesso. ✅\n\n` +
                `📋 *Detalhes da inscrição:*\n` +
                `• Participantes: ${qtdParticipantes}\n` +
                `• Código: ${idCurto}\n\n` +
                `👕 *Retirada da camiseta:*\n` +
                `Apresente o QR Code abaixo no local de retirada:\n\n` +
                `${qrcodeLink}\n\n` +
                `⚠️ _Este link é pessoal e intransferível._\n\n` +
                `Nos vemos na gincana! 🙌`;

            await axios.post(
                `${GincanaConfig.evolutionAPI.url}/message/sendText/${GincanaConfig.evolutionAPI.instanceName}`,
                {
                    number: cleanPhone,
                    text: message,
                    options: { delay: 1200 }
                },
                { headers: { "Content-Type": "application/json", apikey: GincanaConfig.evolutionAPI.apiKey } }
            );
        } catch (error: any) {
            console.error("❌ Erro ao disparar o Zap:", error.response ? error.response.data : error.message);
            throw error;
        }
    }
}
