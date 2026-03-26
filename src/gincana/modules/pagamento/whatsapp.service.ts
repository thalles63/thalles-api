import { Injectable } from "@nestjs/common";
import axios from "axios";
import { GincanaConfig } from "../../infrastructure/config/app.config";

@Injectable()
export class WhatsappService {
    async sendLink(phone: string, idInscricao: string) {
        try {
            // if (GincanaConfig.env === "DEV") {
            //     return;
            // }

            // const cleanPhone = phone.replace(/\D/g, "");
            const cleanPhone = '5554991811871'
            const message = `Olá! Recebemos seu pagamento com sucesso. \n\nPara retirar sua camiseta, acesse o seguinte link: \n\nObrigado!`;

            await axios.post(
                `${GincanaConfig.evolutionAPI.url}/message/sendText/${GincanaConfig.evolutionAPI.instanceName}`,
                {
                    number: cleanPhone,
                    text: message,
                    options: { delay: 1200 }
                },
                { headers: { 'Content-Type': 'application/json', apikey: GincanaConfig.evolutionAPI.apiKey } }
            );
        } catch (error: any) {
            console.error('❌ Erro ao disparar o Zap:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}
