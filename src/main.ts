import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as  cookieParser from 'cookie-parser';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));


  app.enableCors({
    origin: "domainNameLike:http://localhost:5173/",
    method: 'GET , POST , DELETE ,PATCH',
    credentials: true, // to cookie and session
  });
  await app.listen(3000);
}
bootstrap();
