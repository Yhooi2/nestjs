import type { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerConfig } from 'src/core/config/swagger.config';

export function setupSwagger(app: INestApplication) {
  const config = getSwaggerConfig();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: '/api.json',
    yamlDocumentUrl: '/api.yaml',
    customSiteTitle: 'My API Docs',
  });
}
