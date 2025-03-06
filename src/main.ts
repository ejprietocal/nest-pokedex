import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //sirve para colocar un prefijo a la url en general 
  app.setGlobalPrefix('api/v2');


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // solo deja la data que estoy esperando
      forbidNonWhitelisted: true, // muestra el error si hay propiedades fuera del DTO
      transform: true, // transforma la data a la clase que estoy esperando
      transformOptions: {
        enableImplicitConversion: true
      }
    }),

  )

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${process.env.PORT}`)
}
bootstrap();
