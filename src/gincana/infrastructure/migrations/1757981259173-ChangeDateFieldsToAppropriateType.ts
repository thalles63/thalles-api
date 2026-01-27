import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDateFieldsToAppropriateType1757981259173 implements MigrationInterface {
    name = 'ChangeDateFieldsToAppropriateType1757981259173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao" DROP COLUMN "dataPagamento"`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD "dataPagamento" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP COLUMN "dataConfirmacaoPagamento"`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD "dataConfirmacaoPagamento" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "participantes" DROP COLUMN "dataNascimento"`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD "dataNascimento" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participantes" DROP COLUMN "dataNascimento"`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD "dataNascimento" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP COLUMN "dataConfirmacaoPagamento"`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD "dataConfirmacaoPagamento" character varying`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP COLUMN "dataPagamento"`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD "dataPagamento" character varying`);
    }

}
