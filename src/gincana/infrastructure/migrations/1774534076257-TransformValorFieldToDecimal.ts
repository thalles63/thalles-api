import { MigrationInterface, QueryRunner } from "typeorm";

export class TransformValorFieldToDecimal1774534076257 implements MigrationInterface {
    name = 'TransformValorFieldToDecimal1774534076257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao_participante" ALTER COLUMN "valor" TYPE numeric(10,2) USING valor::numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao_participante" ALTER COLUMN "valor" TYPE integer USING valor::integer`);
    }

}

