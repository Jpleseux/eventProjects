import { saveCommitmentsUsecase } from '../../core/usecase/saveCommitments.usecase';
import { CommitmentsRepositoryTypeOrm } from '../../infra/repository/commitments.repository.orm';
import dataSource from '../../../shared/infra/database/datasource';
let repo: CommitmentsRepositoryTypeOrm;
describe('Deve testar o saveCommitmentsUsecase', () => {
  beforeEach(async () => {
    repo = new CommitmentsRepositoryTypeOrm(dataSource);
    await dataSource.initialize();
  });
  afterEach(async () => {
    await dataSource.destroy();
  });
  test('Deve criar um compromisso', async () => {
    const action = new saveCommitmentsUsecase(repo);
    const output = await action.execute({
      date: new Date(Date.now()),
      eventPlace: 'São Paulo',
      time: '07:00',
      title: 'teste',
      user_id: 'd393125f-7b5e-4cb3-9e17-3ef0b51e4d97',
    });
    expect(output.gettitle()).toBe('teste');
    await repo.deleteCommitments(output.getuuid());
  });
});
