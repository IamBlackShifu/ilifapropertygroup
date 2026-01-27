import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { ContractorsModule } from './contractors/contractors.module';
import { VerificationsModule } from './verifications/verifications.module';
import { ProjectsModule } from './projects/projects.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FilesModule } from './files/files.module';
import { AdminModule } from './admin/admin.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    ContractorsModule,
    SuppliersModule,
    VerificationsModule,
    ProjectsModule,
    PaymentsModule,
    NotificationsModule,
    FilesModule,
    AdminModule,
    ServicesModule,
  ],
})
export class AppModule {}
