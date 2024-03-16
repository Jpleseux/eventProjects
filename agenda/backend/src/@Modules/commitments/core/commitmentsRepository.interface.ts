import { commitmentsEntity } from './entities/commitments.entity';

export interface commitmentsRepositoryInterface {
  saveCommitments(input: commitmentsEntity): Promise<void>;
  deleteCommitments(uuid: string): Promise<void>;
  getByUuid(uuid: string): Promise<commitmentsEntity>;
}
