import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  
  // Add global API prefix
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
}
bootstrap();