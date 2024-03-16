import { commitmentsRepositoryInterface } from '../../../commitments/core/commitmentsRepository.interface';
import { commitmentsEntity } from '../../../commitments/core/entities/commitments.entity';
import { DataSource } from 'typeorm';
import { CommitmentsModel } from '../database/models/commitments.model';

export class CommitmentsRepositoryTypeOrm
  implements commitmentsRepositoryInterface
{
  constructor(readonly dataSource: DataSource) {}
  async saveCommitments(input: commitmentsEntity): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(CommitmentsModel)
      .values([
        {
          date: input.getdate(),
          event_place: input.geteventPlace(),
          time: input.gettime(),
          title: input.gettitle(),
          uuid: input.getuuid(),
        },
      ])
      .execute();
  }
  async deleteCommitments(uuid: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(CommitmentsModel)
      .where('uuid = :uuid', { uuid: uuid })
      .execute();
  }
  async getByUuid(uuid: string): Promise<commitmentsEntity> {
    const commitmentDb = await this.dataSource
      .getRepository(CommitmentsModel)
      .createQueryBuilder()
      .where('uuid = :uuid', { uuid: uuid })
      .getOne();
    if (!commitmentDb) {
      return;
    }
    return new commitmentsEntity({
      date: commitmentDb.date,
      eventPlace: commitmentDb.event_place,
      time: commitmentDb.time,
      title: commitmentDb.title,
      uuid: commitmentDb.uuid,
    });
  }
}
