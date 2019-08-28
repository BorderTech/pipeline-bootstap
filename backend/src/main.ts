import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Swagger Configuration */
  const options = new DocumentBuilder()
    .setTitle('Pipeline Bootstrap API')
    .setDescription('The Pipeline Bootstrap API.')
    .setVersion('1.0')
    .addTag('pipeline-bootstrap')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  /* Cors Configuration */
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  await app.listen(5000);
}
bootstrap();
