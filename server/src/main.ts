import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const FRONTEND_ORIGIN = 'https://egygenerator-task.vercel.app';

const logger = new Logger('Bootstrap');

function resolveCorsOrigins(): string[] {
  return [FRONTEND_ORIGIN, 'http://localhost:5173'];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (requestOrigin: string | undefined) => {
      if (!requestOrigin) return false;
      return resolveCorsOrigins().includes(requestOrigin);
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('EgyGenerator API')
    .setDescription(
      'Authentication API for the EgyGenerator full-stack app.\n\n' +
        '1. Call `/auth/signup` or `/auth/signin` to get an access token.\n' +
        '2. Click the **Authorize** button and paste the token to call protected endpoints.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  logger.log(`Server running on http://localhost:${port}`);
  logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap().catch((error: unknown) => {
  logger.error(
    'Application failed to start',
    error instanceof Error ? error.stack : String(error),
  );
  process.exit(1);
});
