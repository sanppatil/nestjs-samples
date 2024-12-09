import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase the request size limit
  app.use(bodyParser.json({ limit: '10mb' })); // Set to 10 MB or any required size
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Cosmos DB API')
    .setDescription('API for uploading JSON data to Azure Cosmos DB')
    .setVersion('1.0')
    .addTag('cosmos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
