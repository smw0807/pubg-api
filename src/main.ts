import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { winstonLogger } from './logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(winstonLogger);

  const configService = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('projectName')!)
    .setDescription('PUBG API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<number>('port') ?? 3000);
}
void bootstrap();
