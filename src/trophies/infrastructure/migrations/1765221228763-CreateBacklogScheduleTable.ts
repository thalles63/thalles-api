import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBacklogScheduleTable1765221228763 implements MigrationInterface {
    name = 'CreateBacklogScheduleTable1765221228763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "backlogSchedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gameId" uuid NOT NULL, "year" integer NOT NULL, "month" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_787cfefdec4a86a89c7e7ab4516" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "backlogSchedule" ADD CONSTRAINT "FK_5c85a8b1685fb47baa415832990" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "backlogSchedule" DROP CONSTRAINT "FK_5c85a8b1685fb47baa415832990"`);
        await queryRunner.query(`DROP TABLE "backlogSchedule"`);
    }

}
