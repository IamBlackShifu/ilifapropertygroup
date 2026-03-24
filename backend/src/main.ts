import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const configuredOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    const expandOriginVariants = (origin: string): string[] => {
      try {
        const url = new URL(origin);
        const variants = new Set<string>([origin]);

        if (url.hostname.startsWith('www.')) {
          variants.add(`${url.protocol}//${url.hostname.replace(/^www\./, '')}${url.port ? `:${url.port}` : ''}`);
        } else if (!['localhost', '127.0.0.1'].includes(url.hostname)) {
          variants.add(`${url.protocol}//www.${url.hostname}${url.port ? `:${url.port}` : ''}`);
        }

        return Array.from(variants);
      } catch {
        return [origin];
      }
    };

    const allowedOrigins = configuredOrigins.length
      ? Array.from(new Set(configuredOrigins.flatMap((origin) => expandOriginVariants(origin))))
      : [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'https://ilifapropertygroup.com',
          'https://www.ilifapropertygroup.com',
        ];

    // Serve static files from uploads directory (use absolute path)
    const uploadsPath = process.env.UPLOAD_DIR 
      ? join(process.cwd(), process.env.UPLOAD_DIR)
      : join(process.cwd(), 'uploads');
    
    console.log('📁 Serving static files from:', uploadsPath);
    
    app.useStaticAssets(uploadsPath, {
      prefix: '/uploads/',
    });

    // Enable CORS
    app.enableCors({
      origin: (origin, callback) => {
        // Allow non-browser requests (curl/Postman) and configured web origins.
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
      },
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // API prefix
    app.setGlobalPrefix('api');

    // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('ILifa Property Group API')
      .setDescription('Construction & Property Verification Platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
