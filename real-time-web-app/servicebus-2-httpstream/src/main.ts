import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if needed
  app.enableCors();

  const PORT = process.env.PORT || 3000;
  console.log(`Starting application on port ${PORT}`); // Debug log

  console.log('Before app.listen()'); // Debug log
  await app.listen(PORT);
  console.log('After app.listen()'); // Debug log

  console.log(`Application is running on: http://localhost:${PORT}`); // Confirm server is running
}
bootstrap();
