import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMercadoPago1768252705915 implements MigrationInterface {
    name = 'AddMercadoPago1768252705915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao" ADD "idMercadoPago" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao" DROP COLUMN "idMercadoPago"`);
    }

}
