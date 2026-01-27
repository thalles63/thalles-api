import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeParticipantStructureToIsolateParticipantType1757982080021 implements MigrationInterface {
    name = 'ChangeParticipantStructureToIsolateParticipantType1757982080021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participantes" DROP CONSTRAINT "FK_f500b3beea73511a268f7d6d4d9"`);
        await queryRunner.query(`CREATE TYPE "public"."inscricao_participante_tipo_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TABLE "inscricao_participante" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tipo" "public"."inscricao_participante_tipo_enum" NOT NULL, "participanteId" character varying NOT NULL, "inscricaoId" uuid NOT NULL, CONSTRAINT "PK_fba025205cca57b25c3475b8fea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "participantes" DROP COLUMN "inscricaoId"`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD "inscricaoId" character varying`);
        await queryRunner.query(`ALTER TABLE "inscricao_participante" ADD CONSTRAINT "FK_31c3df7c19be8053ce5bf091407" FOREIGN KEY ("participanteId") REFERENCES "participantes"("cpf") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscricao_participante" ADD CONSTRAINT "FK_3bbc72d27fcb53ebed453f62657" FOREIGN KEY ("inscricaoId") REFERENCES "inscricao"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao_participante" DROP CONSTRAINT "FK_3bbc72d27fcb53ebed453f62657"`);
        await queryRunner.query(`ALTER TABLE "inscricao_participante" DROP CONSTRAINT "FK_31c3df7c19be8053ce5bf091407"`);
        await queryRunner.query(`ALTER TABLE "participantes" DROP COLUMN "inscricaoId"`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD "inscricaoId" uuid`);
        await queryRunner.query(`DROP TABLE "inscricao_participante"`);
        await queryRunner.query(`DROP TYPE "public"."inscricao_participante_tipo_enum"`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD CONSTRAINT "FK_f500b3beea73511a268f7d6d4d9" FOREIGN KEY ("inscricaoId") REFERENCES "inscricao"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
