import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrations1757980422370 implements MigrationInterface {
    name = 'InitialMigrations1757980422370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inscricao" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dataPagamento" character varying, "dataConfirmacaoPagamento" character varying, "ehPatrocinador" boolean NOT NULL DEFAULT false, "anoEdicao" integer NOT NULL, "valor" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c28e1e6a95a31f051e60b499382" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."participantes_tipo_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TABLE "participantes" ("cpf" uuid NOT NULL DEFAULT uuid_generate_v4(), "dataNascimento" character varying NOT NULL, "email" character varying, "nome" character varying NOT NULL, "telefone" character varying NOT NULL, "tamanhoCamiseta" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "inscricaoId" uuid, "tipo" "public"."participantes_tipo_enum" NOT NULL DEFAULT '2', CONSTRAINT "PK_5cf06e9067899c8a9044a33a961" PRIMARY KEY ("cpf"))`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD CONSTRAINT "FK_f500b3beea73511a268f7d6d4d9" FOREIGN KEY ("inscricaoId") REFERENCES "inscricao"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participantes" DROP CONSTRAINT "FK_f500b3beea73511a268f7d6d4d9"`);
        await queryRunner.query(`DROP TABLE "participantes"`);
        await queryRunner.query(`DROP TYPE "public"."participantes_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "inscricao"`);
    }

}
