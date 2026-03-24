import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const parseConfiguredOrigins = (raw: string): string[] => {
      return raw
        .split(/[;,\n\r]+/)
        .map((origin) => origin.trim())
        .map((origin) => origin.replace(/^['\"]|['\"]$/g, ''))
        .filter(Boolean);
    };

    const normalizeOrigin = (origin: string): string => {
      try {
        const url = new URL(origin);
        const hostname = url.hostname.toLowerCase();
        const protocol = url.protocol.toLowerCase();
        const normalizedPort = url.port ? `:${url.port}` : '';
        return `${protocol}//${hostname}${normalizedPort}`;
      } catch {
        return origin.trim().replace(/\/+$/, '').toLowerCase();
      }
    };

    const configuredOrigins = parseConfiguredOrigins(process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '');
    const allowAllOrigins = configuredOrigins.includes('*');

    const expandOriginVariants = (origin: string): string[] => {
      try {
        const url = new URL(origin);
        const variants = new Set<string>([normalizeOrigin(origin)]);

        if (url.hostname.startsWith('www.')) {
          variants.add(normalizeOrigin(`${url.protocol}//${url.hostname.replace(/^www\./, '')}${url.port ? `:${url.port}` : ''}`));
        } else if (!['localhost', '127.0.0.1'].includes(url.hostname)) {
          variants.add(normalizeOrigin(`${url.protocol}//www.${url.hostname}${url.port ? `:${url.port}` : ''}`));
        }

        return Array.from(variants);
      } catch {
        return [normalizeOrigin(origin)];
      }
    };

    const allowedOrigins = configuredOrigins.length
      ? Array.from(new Set(configuredOrigins.filter((origin) => origin !== '*').flatMap((origin) => expandOriginVariants(origin))))
      : [
          normalizeOrigin('http://localhost:3000'),
          normalizeOrigin('http://127.0.0.1:3000'),
          normalizeOrigin('https://ilifapropertygroup.com'),
          normalizeOrigin('https://www.ilifapropertygroup.com'),
        ];

    console.log('🌐 CORS allowAllOrigins:', allowAllOrigins);
    console.log('🌐 CORS allowed origins:', allowedOrigins);

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
        if (!origin) {
          callback(null, true);
          return;
        }

        const requestOrigin = normalizeOrigin(origin);

        if (allowAllOrigins || allowedOrigins.includes(requestOrigin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${requestOrigin} is not allowed by CORS`), false);
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
