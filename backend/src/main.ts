import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const allowedOrigins = (
    process.env.FRONTEND_URLS ||
    process.env.FRONTEND_URL ||
    'http://localhost:3001'
  )
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin) return callback(null, true);
      const isAllowed =
        allowedOrigins.some((allowed) =>
          requestOrigin.startsWith(allowed.replace(/\/$/, '')),
        ) ||
        /\.vercel\.app$/i.test(new URL(requestOrigin).hostname) ||
        requestOrigin.includes('localhost') ||
        requestOrigin.includes('127.0.0.1');

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, requestOrigin);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
