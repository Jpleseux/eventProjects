import { UserEntity } from '@Modules/auth/core/register/entities/user.entity';
import { commitmentsEntity } from './entities/commitments.entity';

export interface commitmentsRepositoryInterface {
  saveCommitments(input: commitmentsEntity): Promise<void>;
  deleteCommitments(uuid: string): Promise<void>;
  getByUuid(uuid: string): Promise<commitmentsEntity>;
  getByUserUuid(uuid: string): Promise<commitmentsEntity[]>;
  getAllFromToday(): Promise<UserEntity[]>;
}
