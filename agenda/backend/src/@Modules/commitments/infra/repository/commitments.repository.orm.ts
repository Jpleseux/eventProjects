import { commitmentsRepositoryInterface } from '../../../commitments/core/commitmentsRepository.interface';
import { commitmentsEntity } from '../../../commitments/core/entities/commitments.entity';
import { DataSource } from 'typeorm';
import { CommitmentsModel } from '../database/models/commitments.model';
import { UserEntity } from '@Modules/auth/core/register/entities/user.entity';
import { UserModel } from '@Modules/auth/infra/database/models/userModel.model';

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
          user_id: input.getUserId(),
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
      user_id: commitmentDb.user_id,
    });
  }
  async getByUserUuid(uuid: string): Promise<commitmentsEntity[]> {
    const commitmentDb = await this.dataSource
      .getRepository(CommitmentsModel)
      .createQueryBuilder()
      .where('user_id = :uuid', { uuid: uuid })
      .getMany();
    if (!commitmentDb || (commitmentDb && commitmentDb.length === 0)) {
      return [];
    }
    const commitments = [];
    for (const commitment of commitmentDb) {
      commitments.push(
        new commitmentsEntity({
          date: commitment.date,
          eventPlace: commitment.event_place,
          time: commitment.time,
          title: commitment.title,
          user_id: commitment.user_id,
          uuid: commitment.uuid,
        }),
      );
    }
    return commitments;
  }
  async getAllFromToday(): Promise<UserEntity[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 999);
    const commitmentsDb = await this.dataSource
      .getRepository(CommitmentsModel)
      .createQueryBuilder()
      .where('date = :startDate', {
        startDate: today.toISOString().split('T')[0],
      })
      .getMany();

    const usersPromises: Promise<UserEntity>[] = commitmentsDb.map(
      async (commitmentDb) => {
        const user = await this.dataSource
          .getRepository(UserModel)
          .createQueryBuilder()
          .where('uuid = :uuid', { uuid: commitmentDb.user_id })
          .getOne();
        return new UserEntity({
          email: user.email,
          name: user.name,
          password: user.password,
          uuid: user.uuid,
        });
      },
    );

    const users: UserEntity[] = await Promise.all(usersPromises);

    return users;
  }
}
