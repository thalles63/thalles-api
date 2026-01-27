import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustFieldsToTablesThatMareMoreSense1758047093807 implements MigrationInterface {
    name = 'AdjustFieldsToTablesThatMareMoreSense1758047093807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participantes" DROP COLUMN "tamanhoCamiseta"`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP COLUMN "ehPatrocinador"`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP COLUMN "valor"`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP COLUMN "dataConfirmacaoPagamento"`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD "dataInscricao" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD "dataRetiradaCamiseta" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD "ehPatrocinada" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "inscricao_participante" ADD "valor" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inscricao_participante" ADD "tamanhoCamiseta" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao_participante" DROP COLUMN "tamanhoCamiseta"`);
        await queryRunner.query(`ALTER TABLE "inscricao_participante" DROP COLUMN "valor"`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP COLUMN "ehPatrocinada"`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP COLUMN "dataRetiradaCamiseta"`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP COLUMN "dataInscricao"`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD "dataConfirmacaoPagamento" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD "valor" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD "ehPatrocinador" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD "tamanhoCamiseta" integer NOT NULL`);
    }

}
