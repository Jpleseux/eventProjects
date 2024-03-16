/* eslint-disable prettier/prettier */

import { saveUserUsecase } from "../../../core/register/usecases/saveUser.usecase";
import { UserModel } from "../../../infra/database/models/userModel.model";
import { RegisterRepositoryTypeOrm } from "../../../infra/register/repository/registerRepository.typeorm";
import { RegisterGatewayLocal } from "../../../infra/register/gateway/registerGateway.local";
import dataSource from '../../../../shared/infra/database/datasource';

let repo: RegisterRepositoryTypeOrm;
let gateway: RegisterGatewayLocal;
describe("Deve testar o saveUserUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new RegisterRepositoryTypeOrm(dataSource);
    gateway = new RegisterGatewayLocal(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve criar um usuario", async () => {
    const user = {
      email: "user5@gmail.com",
      password: "231231",
      name: "user5",
    };
    const action = new saveUserUsecase(repo, gateway);
    await action.execute(user);
    const userDb = await dataSource
      .getRepository(UserModel)
      .createQueryBuilder()
      .where("email = :email", { email: user.email })
      .getOne();
    expect(userDb.name).toBe("user5");
    await dataSource.createQueryBuilder().delete().from(UserModel).where("email = :email", { email: userDb.email }).execute();
  });
  test("Deve emitir erro de email inválido", async () => {
    const user = {
      email: "user58987932gmail.com",
      password: "231231",
      name: "user5",
    };
    const action = new saveUserUsecase(repo, gateway);
    await expect(async () => {
      await action.execute(user);
    }).rejects.toThrow("Este email é inválido");
  })
  test("Deve emitir erro de usuario já existente", async () => {
    const user = {
      email: "user1@gmail.com",
      password: "231231",
      name: "user5",
    };
    const action = new saveUserUsecase(repo, gateway);
    await expect(async () => {
      await action.execute(user);
    }).rejects.toThrow("Esse email já foi cadastrado no banco");
  })
});
