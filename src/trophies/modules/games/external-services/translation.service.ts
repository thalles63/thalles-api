import { GoogleGenerativeAI } from "@google/generative-ai";
import { Injectable } from "@nestjs/common";
import { Achievement } from "../../../domain/entities/achievements.entity";
import { TrophiesConfig } from "../../../infrastructure/config/app.config";

@Injectable()
export class TranslationService {
    private readonly genAI: GoogleGenerativeAI;
    private readonly model: any;

    constructor() {
        const apiKey = TrophiesConfig.gemini.apiKey;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY não configurada no .env");
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }

    async translateGameAndAchievementsData(summaryEn: string, achievements: Achievement[]) {
        const inputPayload = {
            summary: summaryEn,
            achievements: achievements.map((a) => ({
                id: a.id,
                description: a.description
            }))
        };

        const prompt = `
            Você é um tradutor especializado em localização de videogames (PT-BR).
            Receba o JSON abaixo contendo o resumo de um jogo e suas conquistas (achievements).

            Tarefas:
            1. Traduza o "summary" para um tom natural.
            2. Traduza o "description" de cada achievement.
            3. Mantenha termos técnicos em inglês (Headshot, Killstreak, RPG, etc).
            4. Mantenha a estrutura do JSON idêntica, apenas traduza os valores.

            Entrada JSON:
            ${JSON.stringify(inputPayload)}

            IMPORTANTE: Retorne APENAS o JSON puro. NÃO use blocos de código markdown (\`\`\`).
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const responseText = result.response.text();
            const cleanedText = responseText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            const translatedData = JSON.parse(cleanedText);

            return translatedData;
        } catch (error) {
            console.error("Erro na tradução em lote:", error);
            return null;
        }
    }

    async translateGameData(summaryEn: string) {
        const inputPayload = {
            summary: summaryEn
        };

        const prompt = `
            Você é um tradutor especializado em localização de videogames (PT-BR).
            Receba o JSON abaixo contendo o resumo de um jogo.

            Tarefas:
            1. Traduza o "summary" para um tom natural.
            2. Mantenha termos técnicos em inglês (Headshot, Killstreak, RPG, etc).
            3. Mantenha a estrutura do JSON idêntica, apenas traduza os valores.

            Entrada JSON:
            ${JSON.stringify(inputPayload)}

            IMPORTANTE: Retorne APENAS o JSON puro. NÃO use blocos de código markdown (\`\`\`).
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const responseText = result.response.text();
            const cleanedText = responseText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            const translatedData = JSON.parse(cleanedText);

            return translatedData;
        } catch (error) {
            console.error("Erro na tradução em lote:", error);
            return null;
        }
    }

    async translateAchievementsData(achievements: Achievement[]) {
        const inputPayload = {
            achievements: achievements.map((a) => ({
                id: a.id,
                description: a.description
            }))
        };

        const prompt = `
            Você é um tradutor especializado em localização de videogames (PT-BR).
            Receba o JSON abaixo contendo as conquistas do jogo (achievements).

            Tarefas:
            1. Traduza o "description" de cada achievement.
            2. Mantenha termos técnicos em inglês (Headshot, Killstreak, RPG, etc).
            3. Mantenha a estrutura do JSON idêntica, apenas traduza os valores.

            Entrada JSON:
            ${JSON.stringify(inputPayload)}

            IMPORTANTE: Retorne APENAS o JSON puro. NÃO use blocos de código markdown (\`\`\`).
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const responseText = result.response.text();
            const cleanedText = responseText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            const translatedData = JSON.parse(cleanedText);

            return translatedData;
        } catch (error) {
            console.error("Erro na tradução em lote:", error);
            return null;
        }
    }
}
