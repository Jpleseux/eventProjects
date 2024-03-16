import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { AuthorizationMiddleware } from '../middlewares/autorization.middleware';
import { RegisterRepositoryTypeOrm } from '@Modules/auth/infra/register/repository/registerRepository.typeorm';
import { RegisterGatewayLocal } from '@Modules/auth/infra/register/gateway/registerGateway.local';
import { LoginGatewayLocal } from '@Modules/auth/infra/login/gateway/loginGatewayLocal.local';
import { LoginRepositoryTypeorm } from '@Modules/auth/infra/login/repository/loginRepositoryTypeOrm.orm';
import { middlewareGateway } from '@Modules/shared/infra/gateway/middleware.gateway';
@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: RegisterRepositoryTypeOrm,
      useFactory: (dataSource: DataSource) => {
        return new RegisterRepositoryTypeOrm(dataSource);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: RegisterGatewayLocal,
      useFactory: (dataSource: DataSource) => {
        return new RegisterGatewayLocal(dataSource);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: LoginGatewayLocal,
      useFactory: (dataSource: DataSource) => {
        return new LoginGatewayLocal(dataSource);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: LoginRepositoryTypeorm,
      useFactory: (dataSource: DataSource) => {
        return new LoginRepositoryTypeorm(dataSource);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: middlewareGateway,
      useFactory: (dataSource: DataSource) => {
        return new middlewareGateway(dataSource);
      },
      inject: [getDataSourceToken()],
    },
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes('auth/protected');
  }
}
