import { commitmentsRepositoryInterface } from '../commitmentsRepository.interface';
import { commitmentsEntity } from '../entities/commitments.entity';

export class getCommitmentByUserUuid {
  constructor(readonly repo: commitmentsRepositoryInterface) {}
  public async execute(uuid: string): Promise<commitmentsEntity[]> {
    const commitments = await this.repo.getByUserUuid(uuid);
    return commitments;
  }
}
