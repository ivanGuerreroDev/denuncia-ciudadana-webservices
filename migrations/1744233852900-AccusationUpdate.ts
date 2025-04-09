import { MigrationInterface, QueryRunner } from "typeorm";

export class AccusationUpdate1744233852900 implements MigrationInterface {
    name = 'AccusationUpdate1744233852900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accusations" DROP CONSTRAINT "FK_accusation_type"`);
        await queryRunner.query(`ALTER TABLE "accusations" DROP CONSTRAINT "FK_user"`);
        await queryRunner.query(`ALTER TABLE "accusation_data" DROP CONSTRAINT "FK_accusation"`);
        await queryRunner.query(`ALTER TABLE "accusations" ADD CONSTRAINT "FK_cfde6f3a3b3441962d7aa44c511" FOREIGN KEY ("accusationTypeId") REFERENCES "accusation_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accusations" ADD CONSTRAINT "FK_d646072dc158290401e6d0e5cd9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accusation_data" ADD CONSTRAINT "FK_900ab1fd58bc82159b064e6053b" FOREIGN KEY ("accusationId") REFERENCES "accusations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accusation_data" DROP CONSTRAINT "FK_900ab1fd58bc82159b064e6053b"`);
        await queryRunner.query(`ALTER TABLE "accusations" DROP CONSTRAINT "FK_d646072dc158290401e6d0e5cd9"`);
        await queryRunner.query(`ALTER TABLE "accusations" DROP CONSTRAINT "FK_cfde6f3a3b3441962d7aa44c511"`);
        await queryRunner.query(`ALTER TABLE "accusation_data" ADD CONSTRAINT "FK_accusation" FOREIGN KEY ("accusationId") REFERENCES "accusations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accusations" ADD CONSTRAINT "FK_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accusations" ADD CONSTRAINT "FK_accusation_type" FOREIGN KEY ("accusationTypeId") REFERENCES "accusation_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
