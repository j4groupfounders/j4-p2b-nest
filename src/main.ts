import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('NestJS Realworld Example App')
    .setDescription('The Realworld API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  // Preserve pre-upgrade NestJS default 404 JSON shape for routes outside the
  // global prefix (e.g. '/'), which newer platform-express adapters no longer
  // intercept with Nest's own not-found handler. Agent decision, not a hidden
  // framework behavior change: documented in REPORT.md.
  // Must run after Nest has bound its own module routes onto the underlying
  // Express instance (init()), otherwise this catch-all shadows every route.
  await app.init();
  app.use((req: any, res: any) => {
    res.status(404).json({
      statusCode: 404,
      message: `Cannot ${req.method} ${req.originalUrl}`,
      error: 'Not Found',
    });
  });

  await app.listen(3000);
}
bootstrap()
  .catch((err) => {
    console.log(err);
  });
