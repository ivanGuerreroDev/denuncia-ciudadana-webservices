import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccusations1700000000000 implements MigrationInterface {
    name = 'CreateAccusations1700000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create accusation_types table
        await queryRunner.query(
            `CREATE TABLE "accusation_types" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                CONSTRAINT "PK_accusation_types" PRIMARY KEY ("id")
            )`,
        );

        // Create accusations table
        await queryRunner.query(
            `CREATE TABLE "accusations" (
                "id" SERIAL NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "accusationTypeId" integer,
                "userId" integer,
                CONSTRAINT "PK_accusations" PRIMARY KEY ("id")
            )`,
        );

        // Create accusation_data table
        await queryRunner.query(
            `CREATE TABLE "accusation_data" (
                "id" SERIAL NOT NULL,
                "key" character varying(100) NOT NULL,
                "value" text NOT NULL,
                "accusationId" integer,
                CONSTRAINT "PK_accusation_data" PRIMARY KEY ("id")
            )`,
        );

        // Add foreign key constraints
        await queryRunner.query(
            `ALTER TABLE "accusations" ADD CONSTRAINT "FK_accusation_type" FOREIGN KEY ("accusationTypeId") REFERENCES "accusation_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "accusations" ADD CONSTRAINT "FK_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "accusation_data" ADD CONSTRAINT "FK_accusation" FOREIGN KEY ("accusationId") REFERENCES "accusations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first
        await queryRunner.query(`ALTER TABLE "accusation_data" DROP CONSTRAINT "FK_accusation"`);
        await queryRunner.query(`ALTER TABLE "accusations" DROP CONSTRAINT "FK_user"`);
        await queryRunner.query(`ALTER TABLE "accusations" DROP CONSTRAINT "FK_accusation_type"`);
        
        // Drop tables
        await queryRunner.query(`DROP TABLE "accusation_data"`);
        await queryRunner.query(`DROP TABLE "accusations"`);
        await queryRunner.query(`DROP TABLE "accusation_types"`);
    }
}
