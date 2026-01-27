import { Injectable } from "@nestjs/common";
import axios from "axios";
import { GincanaConfig } from "../../infrastructure/config/app.config";

@Injectable()
export class WhatsappService {
    async sendLink(phone: string, idInscricao: string) {
        try {
            const cleanPhone = phone.replace(/\D/g, "");
            const message = `Olá! Recebemos seu pagamento com sucesso. \n\nPara retirar sua camiseta, acesse o seguinte link: \n\nObrigado!`;

            await axios.post(
                `${GincanaConfig.evolutionAPI.url}/message/sendText/${GincanaConfig.evolutionAPI.instanceName}`,
                {
                    number: cleanPhone,
                    textMessage: { text: message },
                    options: { delay: 1200 }
                },
                { headers: { apikey: GincanaConfig.evolutionAPI.apiKey } }
            );
        } catch (error) {
            console.log(error);
        }
    }
}
