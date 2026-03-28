import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformResInterceptor } from './common/interceptors';
import { setupSwagger } from './common/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  //for now i have omited the cors in. this project

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(new TransformResInterceptor());

  const PORT = configService.getOrThrow<number>('PORT');

  setupSwagger({
    app,
    title: 'Real Estate Broker Search Page',
    description: 'Real Estate Broker Search Page API',
  });

  await app.listen(PORT);

  console.log(
    `\n\t🚀 Consumers API is running on port: http://localhost:${PORT}\n`,
    `\t📄 Access swagger here: http://localhost:${PORT}/swagger`,
  );
}
bootstrap();
