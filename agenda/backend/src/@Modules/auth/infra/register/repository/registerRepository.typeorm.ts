import { UserEntity } from '../../../core/register/entities/user.entity';
import { RegisterRepositoryInterface } from '../../../core/register/registerRepository.interface';
import { DataSource } from 'typeorm';
import { UserModel } from '../../database/models/userModel.model';

export class RegisterRepositoryTypeOrm implements RegisterRepositoryInterface {
  constructor(readonly dataSource: DataSource) {}
  async saveUser(user: UserEntity): Promise<UserEntity> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(UserModel)
      .values([
        {
          email: user.email(),
          password: user.password(),
          uuid: user.uuid(),
          name: user.name(),
        },
      ])
      .execute();
    return user;
  }
  async findByEmail(email: string): Promise<UserEntity> {
    const userDb = await this.dataSource
      .getRepository(UserModel)
      .createQueryBuilder()
      .where('email = :email', { email: email })
      .getOne();
    if (!userDb) {
      return;
    }
    return new UserEntity(userDb);
  }
}
