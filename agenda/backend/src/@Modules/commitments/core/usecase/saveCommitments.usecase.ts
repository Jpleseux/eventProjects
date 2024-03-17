import { randomUUID } from 'crypto';
import { commitmentsEntity } from '../entities/commitments.entity';
import { commitmentsRepositoryInterface } from '../commitmentsRepository.interface';

export type saveCommitmentsInput = {
  date: Date;
  time: string;
  title: string;
  eventPlace: string;
  user_id: string;
};
export class saveCommitmentsUsecase {
  constructor(readonly repo: commitmentsRepositoryInterface) {}
  public async execute(
    input: saveCommitmentsInput,
  ): Promise<commitmentsEntity> {
    const entity = new commitmentsEntity({
      date: input.date,
      eventPlace: input.eventPlace,
      time: input.time,
      title: input.title,
      uuid: randomUUID(),
      user_id: input.user_id,
    });
    await this.repo.saveCommitments(entity);
    return entity;
  }
}
