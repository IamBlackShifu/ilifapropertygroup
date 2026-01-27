import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { PaynowService } from './paynow.service';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [PaynowService, SubscriptionService],
  exports: [PaynowService, SubscriptionService],
})
export class PaymentsModule {}
