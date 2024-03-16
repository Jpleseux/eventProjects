require('dotenv').config();
import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModel } from '@Modules/auth/infra/database/models/userModel.model';
import { CommitmentModule } from './commitments/commitment.module';
import { CommitmentsModel } from '@Modules/commitments/infra/database/models/commitments.model';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_DEFAULT_DRIVER as any,
      host: process.env.DB_DEFAULT_HOST,
      port: process.env.DB_DEFAULT_PORT as any,
      database: process.env.DB_DEFAULT_NAME,
      username: process.env.DB_DEFAULT_USENAME,
      schema: process.env.DB_DEFAULT_SCHEMA ?? 'public',
      password: process.env.DB_DEFAULT_PASSWORD,
      entities: [UserModel, CommitmentsModel],
    }),
    AuthModule,
    CommitmentModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
