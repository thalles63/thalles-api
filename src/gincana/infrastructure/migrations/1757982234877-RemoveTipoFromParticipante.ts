import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTipoFromParticipante1757982234877 implements MigrationInterface {
    name = 'RemoveTipoFromParticipante1757982234877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participantes" DROP COLUMN "tipo"`);
        await queryRunner.query(`DROP TYPE "public"."participantes_tipo_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."participantes_tipo_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`ALTER TABLE "participantes" ADD "tipo" "public"."participantes_tipo_enum" NOT NULL DEFAULT '2'`);
    }

}
