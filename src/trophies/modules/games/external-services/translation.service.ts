import { GoogleGenerativeAI } from "@google/generative-ai";
import { Injectable } from "@nestjs/common";
import { Achievement } from "../../../domain/entities/achievements.entity";
import { TrophiesConfig } from "../../../infrastructure/config/app.config";

@Injectable()
export class TranslationService {
    private readonly model: any;

    constructor() {
        const apiKey = TrophiesConfig.gemini.apiKey;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY não configurada no .env");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" }, { apiVersion: "v1beta" });
    }

    private readonly generationConfig = {
        temperature: 0.1,
        responseMimeType: "application/json"
    };

    async translateGameAndAchievementsData(summaryEn: string, achievements: Achievement[], gameName: string) {
        const inputPayload = {
            summary: summaryEn,
            achievements: achievements.map((a) => ({ id: a.id, description: a.description }))
        };

        const prompt = `
            Você é um tradutor especializado em localização de videogames para PT-BR.

            Regras:
            - Traduza com naturalidade, como uma localização oficial brasileira
            - Mantenha a estrutura JSON idêntica — apenas traduza os valores de texto
            - NÃO altere os campos "id"
            - O jogo que você irá traduzir se chama: ${gameName} use nomenclaturas e expressões que façam sentido para esse jogo

            Traduza o JSON abaixo:
            ${JSON.stringify(inputPayload)}
        `;

        try {
            const result = await this.model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: this.generationConfig
            });
            return JSON.parse(result.response.text());
        } catch (error) {
            console.error("Erro na tradução (game + achievements):", error);
            return null;
        }
    }

    async translateGameData(summaryEn: string, gameName: string) {
        const inputPayload = { summary: summaryEn };

        const prompt = `
            Você é um tradutor especializado em localização de videogames para PT-BR.

            Regras:
            - Traduza com naturalidade, como uma localização oficial brasileira
            - Mantenha a estrutura JSON idêntica — apenas traduza os valores de texto
            - O jogo que você irá traduzir se chama: ${gameName} use nomenclaturas e expressões que façam sentido para esse jogo

            Traduza o JSON abaixo:
            ${JSON.stringify(inputPayload)}
        `;

        try {
            const result = await this.model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: this.generationConfig
            });
            return JSON.parse(result.response.text());
        } catch (error) {
            console.error("Erro na tradução (game):", error);
            return null;
        }
    }

    async translateAchievementsData(achievements: Achievement[], gameName: string) {
        const inputPayload = {
            achievements: achievements.map((a) => ({ id: a.id, description: a.description }))
        };

        const prompt = `
            Você é um tradutor especializado em localização de videogames para PT-BR.

            Regras:
            - Traduza as descrições das conquistas com naturalidade
            - Mantenha a estrutura JSON idêntica — apenas traduza os valores de texto
            - NÃO altere os campos "id"
            - O jogo que você irá traduzir se chama: ${gameName} use nomenclaturas e expressões que façam sentido para esse jogo

            Traduza o JSON abaixo:
            ${JSON.stringify(inputPayload)}
        `;

        try {
            const result = await this.model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: this.generationConfig
            });
            return JSON.parse(result.response.text());
        } catch (error) {
            console.error("Erro na tradução (achievements):", error);
            return null;
        }
    }
}
