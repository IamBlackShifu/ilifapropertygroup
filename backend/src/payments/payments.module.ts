import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaynowService } from './paynow.service';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaynowService, SubscriptionService],
  exports: [PaymentsService, PaynowService, SubscriptionService],
})
export class PaymentsModule {}
