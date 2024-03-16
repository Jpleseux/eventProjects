import { NestFactory } from '@nestjs/core';
import { AppModule } from './http/nestjs/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AuthModule } from './http/nestjs/auth/auth.module';
import { CommitmentModule } from './http/nestjs/commitments/commitment.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Agenda')
    .setDescription('Documentação Agenda')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Authorization',
    )
    .addTag('Auth')
    .addTag('Commitment')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [AuthModule, CommitmentModule],
  });
  SwaggerModule.setup('doc', app, swaggerDoc);

  await app.listen(3000);
}
bootstrap();
