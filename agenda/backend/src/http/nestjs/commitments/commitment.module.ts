import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { AuthorizationMiddleware } from '../middlewares/autorization.middleware';
import { CommitmentController } from './commitment.controller';
import { CommitmentsRepositoryTypeOrm } from '@Modules/commitments/infra/repository/commitments.repository.orm';
import { middlewareGateway } from '@Modules/shared/infra/gateway/middleware.gateway';
import { EmailNotificationService } from './adviceTimeService.service';
import { ScheduleModule } from '@nestjs/schedule'; // Importe o ScheduleModule

@Module({
  imports: [ScheduleModule.forRoot()], // Importe o ScheduleModule aqui
  controllers: [CommitmentController],
  providers: [
    {
      provide: CommitmentsRepositoryTypeOrm,
      useFactory: (dataSource: DataSource) => {
        return new CommitmentsRepositoryTypeOrm(dataSource);
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
    EmailNotificationService,
  ],
})
export class CommitmentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes('commitment');
  }
}
