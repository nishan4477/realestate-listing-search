import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Response } from 'express';
import yaml from 'yaml';

export function setupSwagger({
  app,
  title = 'Real Estate Broker Search Page',
  description = 'Real Estate Broker Search Page API',
  versions,
}: {
  app: INestApplication;
  title?: string;
  description?: string;
  versions?: string[];
}) {
  let builder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion('1.0')
    .addTag('api');

  if (versions?.length) {
    versions.forEach((version) => {
      builder = builder.addServer(`/api/v${version}`);
    });
  }
  if (process.env.NODE_ENV === 'development') {
    builder = builder.addServer('/');
  }

  const config = builder.build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  const swaggerDocument = documentFactory();

  SwaggerModule.setup('swagger', app, swaggerDocument);

  app.getHttpAdapter().get('/swagger.yaml', (req, res: Response) => {
    res.type('yaml');
    res.send(yaml.stringify(swaggerDocument));
  });
}
