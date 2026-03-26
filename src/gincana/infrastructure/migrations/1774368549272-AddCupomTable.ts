import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCupomTable1774368549272 implements MigrationInterface {
    name = 'AddCupomTable1774368549272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cupons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo" character varying NOT NULL, "limiteUsos" integer NOT NULL, "quantidadeUtilizada" integer NOT NULL DEFAULT '0', "ativo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_252bc40922061270d3eed03b142" UNIQUE ("codigo"), CONSTRAINT "PK_a391ecb025ec40b07972ed7de19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD "isPatrocinador" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD "cupomUsado" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participantes" DROP COLUMN "cupomUsado"`);
        await queryRunner.query(`ALTER TABLE "participantes" DROP COLUMN "isPatrocinador"`);
        await queryRunner.query(`DROP TABLE "cupons"`);
    }

}
