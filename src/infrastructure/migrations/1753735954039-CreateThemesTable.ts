import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateThemesTable1753735954039 implements MigrationInterface {
    name = 'CreateThemesTable1753735954039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "themes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "PK_ddbeaab913c18682e5c88155592" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gamesThemes" ("gameId" uuid NOT NULL, "themeId" uuid NOT NULL, CONSTRAINT "PK_d9ac32495a4c7e915031dad4a5e" PRIMARY KEY ("gameId", "themeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_95a8fc2d036a0369436bf26aec" ON "gamesThemes" ("gameId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3e1478999429a1a848a59ad497" ON "gamesThemes" ("themeId") `);
        await queryRunner.query(`ALTER TABLE "gamesThemes" ADD CONSTRAINT "FK_95a8fc2d036a0369436bf26aec1" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "gamesThemes" ADD CONSTRAINT "FK_3e1478999429a1a848a59ad4971" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gamesThemes" DROP CONSTRAINT "FK_3e1478999429a1a848a59ad4971"`);
        await queryRunner.query(`ALTER TABLE "gamesThemes" DROP CONSTRAINT "FK_95a8fc2d036a0369436bf26aec1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3e1478999429a1a848a59ad497"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95a8fc2d036a0369436bf26aec"`);
        await queryRunner.query(`DROP TABLE "gamesThemes"`);
        await queryRunner.query(`DROP TABLE "themes"`);
    }

}
