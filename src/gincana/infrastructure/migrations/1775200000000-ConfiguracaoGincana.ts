import { MigrationInterface, QueryRunner } from "typeorm";

export class ConfiguracaoGincana1775200000000 implements MigrationInterface {
    name = "ConfiguracaoGincana1775200000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "configuracao_gincana" (
                "id" integer NOT NULL,
                "inscricoesEncerradas" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_configuracao_gincana" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`INSERT INTO "configuracao_gincana" ("id", "inscricoesEncerradas") VALUES (1, false)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "configuracao_gincana"`);
    }
}
