import { commitmentsRepositoryInterface } from '../commitmentsRepository.interface';
import { apiError } from '../../../../http/nestjs/helpers/api-Error.helper';
export class deleteCommitments {
  constructor(readonly repo: commitmentsRepositoryInterface) {}
  public async execute(uuid: string): Promise<void> {
    const commitments = await this.repo.getByUuid(uuid);
    if (!commitments) {
      throw new apiError('Nenhum evento encontrado', 404, 'NOT_FOUND');
    }
    await this.repo.deleteCommitments(commitments.getuuid());
  }
}
