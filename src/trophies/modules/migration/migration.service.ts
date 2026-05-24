import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { Achievement } from "../../domain/entities/achievements.entity";
import { Game } from "../../domain/entities/games.entity";
import { CloudinaryService } from "../image/cloudinary.service";

const log = (msg: string) => process.stdout.write(msg + "\n");
const warn = (msg: string) => process.stderr.write(msg + "\n");

export interface MigrationFailure {
    gameId: string;
    gameName: string;
    achievementId?: string;
    achievementName?: string;
    field: string;
    url: string;
    error: string;
}

export interface MigrationReport {
    totalGames: number;
    successCount: number;
    skippedCount: number;
    failedCount: number;
    failures: MigrationFailure[];
}

const BATCH_SIZE = 5;

@Injectable()
export class MigrationService {
    constructor(
        @InjectRepository(Game, OrmConnectionEnum.Trophies) private readonly gameRepository: Repository<Game>,
        @InjectRepository(Achievement, OrmConnectionEnum.Trophies) private readonly achievementRepository: Repository<Achievement>,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    async migrateAllImages(): Promise<MigrationReport> {
        const games = await this.gameRepository.find({ relations: ["achievements"] });
        const failures: MigrationFailure[] = [];
        let successCount = 0;
        let skippedCount = 0;

        log(`━━━ Iniciando migração de imagens — ${games.length} jogos ━━━`);

        for (let i = 0; i < games.length; i += BATCH_SIZE) {
            const batch = games.slice(i, i + BATCH_SIZE);
            const results = await Promise.allSettled(
                batch.map((game) => this.migrateGame(game, failures))
            );

            results.forEach((result, idx) => {
                if (result.status === "fulfilled") {
                    successCount += result.value.success;
                    skippedCount += result.value.skipped;
                } else {
                    warn(`[${batch[idx].name}] Erro inesperado: ${result.reason}`);
                }
            });
        }

        const report = { totalGames: games.length, successCount, skippedCount, failedCount: failures.length, failures };

        log(`━━━ Migração concluída — ✔ ${successCount} migradas | ⏭ ${skippedCount} puladas | ✖ ${failures.length} falhas ━━━`);

        const reportPath = join(process.cwd(), "migration-report.json");
        writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
        log(`Relatório salvo em: ${reportPath}`);

        return report;
    }

    private async migrateGame(game: Game, failures: MigrationFailure[]): Promise<{ success: number; skipped: number }> {
        log(`[${game.name}] Processando...`);

        let success = 0;
        let skipped = 0;

        const gameImageFields: Array<{ field: keyof Game; key: string; label: string }> = [
            { field: "image", key: "image", label: "cover" },
            { field: "imageSteam", key: "imageSteam", label: "steam" },
            { field: "imageRawg", key: "imageRawg", label: "rawg" }
        ];

        for (const { field, key, label } of gameImageFields) {
            const url = game[field] as string | null;

            if (!url) continue;

            if (this.cloudinaryService.isCloudinaryUrl(url)) {
                log(`  [${game.name}] ⏭ ${label} — já migrado`);
                skipped++;
                continue;
            }

            try {
                const cloudinaryUrl = await this.cloudinaryService.uploadFromUrl(url, this.cloudinaryService.gamePublicId(game.id, key));
                await this.gameRepository.update({ id: game.id }, { [field]: cloudinaryUrl });
                log(`  [${game.name}] ✔ ${label} — migrado`);
                success++;
            } catch (error) {
                const msg = error instanceof Error ? error.message : JSON.stringify(error);
                warn(`  [${game.name}] ✖ ${label} — ${msg}`);
                failures.push({ gameId: game.id, gameName: game.name, field: key, url, error: msg });
            }
        }

        if (game.screenshots) {
            const screenshots = game.screenshots.split(",");
            const updatedScreenshots = [...screenshots];
            let screenshotsChanged = false;

            for (let i = 0; i < screenshots.length; i++) {
                const url = screenshots[i].trim();

                if (!url) continue;

                if (this.cloudinaryService.isCloudinaryUrl(url)) {
                    log(`  [${game.name}] ⏭ screenshot_${i} — já migrado`);
                    skipped++;
                    continue;
                }

                try {
                    const cloudinaryUrl = await this.cloudinaryService.uploadFromUrl(url, this.cloudinaryService.gamePublicId(game.id, `screenshot_${i}`));
                    updatedScreenshots[i] = cloudinaryUrl;
                    screenshotsChanged = true;
                    log(`  [${game.name}] ✔ screenshot_${i} — migrado`);
                    success++;
                } catch (error) {
                    const msg = error instanceof Error ? error.message : JSON.stringify(error);
                    warn(`  [${game.name}] ✖ screenshot_${i} — ${msg}`);
                    failures.push({ gameId: game.id, gameName: game.name, field: `screenshot_${i}`, url, error: msg });
                }
            }

            if (screenshotsChanged) {
                await this.gameRepository.update({ id: game.id }, { screenshots: updatedScreenshots.join(",") });
            }
        }

        if (game.achievements?.length) {
            let blocked = false;

            for (const achievement of game.achievements) {
                const url = achievement.image;

                if (!url) continue;

                if (this.cloudinaryService.isCloudinaryUrl(url)) {
                    log(`  [${game.name}] ⏭ achievement "${achievement.name}" — já migrado`);
                    skipped++;
                    continue;
                }

                if (blocked) {
                    failures.push({ gameId: game.id, gameName: game.name, achievementId: achievement.id, achievementName: achievement.name, field: "image", url, error: "403 Forbidden (fonte bloqueou — demais achievements pulados)" });
                    continue;
                }

                try {
                    const cloudinaryUrl = await this.cloudinaryService.uploadFromUrl(url, this.cloudinaryService.achievementPublicId(game.id, achievement.id));
                    await this.achievementRepository.update({ id: achievement.id }, { image: cloudinaryUrl });
                    log(`  [${game.name}] ✔ achievement "${achievement.name}" — migrado`);
                    success++;
                } catch (error) {
                    const msg = error instanceof Error ? error.message : JSON.stringify(error);
                    warn(`  [${game.name}] ✖ achievement "${achievement.name}" — ${msg}`);
                    failures.push({ gameId: game.id, gameName: game.name, achievementId: achievement.id, achievementName: achievement.name, field: "image", url, error: msg });

                    if (msg.startsWith("403")) {
                        blocked = true;
                        warn(`  [${game.name}] ⛔ fonte bloqueou (403) — pulando achievements restantes`);
                    }
                }
            }
        }

        return { success, skipped };
    }
}
