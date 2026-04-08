import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFranchisesTableAndAddFranchiseIdToGames1771000000000 implements MigrationInterface {
    name = "CreateFranchisesTableAndAddFranchiseIdToGames1771000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "franchises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_franchises" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "games" ADD "franchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_games_franchiseId" FOREIGN KEY ("franchiseId") REFERENCES "franchises"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_games_franchiseId"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "franchiseId"`);
        await queryRunner.query(`DROP TABLE "franchises"`);
    }
}
