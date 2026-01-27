import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterPkTypeForParticipant1757981453553 implements MigrationInterface {
    name = 'AlterPkTypeForParticipant1757981453553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participantes" DROP CONSTRAINT "PK_5cf06e9067899c8a9044a33a961"`);
        await queryRunner.query(`ALTER TABLE "participantes" DROP COLUMN "cpf"`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD "cpf" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD CONSTRAINT "PK_5cf06e9067899c8a9044a33a961" PRIMARY KEY ("cpf")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participantes" DROP CONSTRAINT "PK_5cf06e9067899c8a9044a33a961"`);
        await queryRunner.query(`ALTER TABLE "participantes" DROP COLUMN "cpf"`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD "cpf" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD CONSTRAINT "PK_5cf06e9067899c8a9044a33a961" PRIMARY KEY ("cpf")`);
    }

}
