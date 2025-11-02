import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAchievements1746882211375 implements MigrationInterface {
    name = 'CreateAchievements1746882211375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "achievements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "image" character varying, "percentageAchieved" numeric(5,2) NOT NULL DEFAULT '0', "gameId" uuid, CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "achievements" ADD CONSTRAINT "FK_e8aac7dad522b2f75e393e684ac" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" DROP CONSTRAINT "FK_e8aac7dad522b2f75e393e684ac"`);
        await queryRunner.query(`DROP TABLE "achievements"`);
    }

}
