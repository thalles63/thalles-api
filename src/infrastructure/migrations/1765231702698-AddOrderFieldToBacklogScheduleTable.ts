import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderFieldToBacklogScheduleTable1765231702698 implements MigrationInterface {
    name = 'AddOrderFieldToBacklogScheduleTable1765231702698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "backlogSchedule" ADD "order" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "backlogSchedule" DROP COLUMN "order"`);
    }

}
