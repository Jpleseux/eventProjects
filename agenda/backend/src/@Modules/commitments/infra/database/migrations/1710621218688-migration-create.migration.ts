import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class commitments_migration1710621218688 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'commitments',
        columns: [
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
            default: null,
          },
          {
            name: 'uuid',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'PK_commitments',
          },
          {
            name: 'date',
            type: 'Date',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'event_place',
            type: 'varchar',
          },
          {
            name: 'time',
            type: 'varchar',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
