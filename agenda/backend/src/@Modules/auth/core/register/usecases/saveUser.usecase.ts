import { RegisterRepositoryInterface } from '../registerRepository.interface';
import { apiError } from '../../../../../http/nestjs/helpers/api-Error.helper';
import { RegisterGatewayInterface } from '../registerGateway.interface';
import { randomUUID } from 'crypto';
import { UserEntity } from '../entities/user.entity';

export type userInput = {
  email: string;
  password: string;
  name: string;
};
export type signUpOutput = {
  user: UserEntity;
  token: string;
};
export class saveUserUsecase {
  constructor(
    readonly repo: RegisterRepositoryInterface,
    readonly gateway: RegisterGatewayInterface,
  ) {}
  public async execute(user: userInput): Promise<signUpOutput> {
    const userDb = await this.repo.findByEmail(user.email);
    if ((await this.gateway.validateEmail(user.email)) === false) {
      throw new apiError('Este email é inválido', 400, 'invalid_item');
    } else if (userDb) {
      throw new apiError(
        'Esse email já foi cadastrado no banco',
        400,
        'INVALID',
      );
    }
    const input = new UserEntity({
      email: user.email,
      password: await this.gateway.encryptPassword(user.password),
      name: user.name,
      uuid: randomUUID(),
    });
    const output = await this.repo.saveUser(input);

    const token = await this.gateway.tokenGenerate(output);
    return { user: output, token: token };
  }
}
