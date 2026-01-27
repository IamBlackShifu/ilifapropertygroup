import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan, SubscriptionStatus, UserRole } from '@prisma/client';
import { PaynowService } from '../payments/paynow.service';

interface SubscriptionPlanDetails {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: {
    maxProperties?: number;
    maxProducts?: number;
    maxProjects?: number;
    canReceiveLeads: boolean;
    canAccessAnalytics: boolean;
    prioritySupport: boolean;
  };
}

@Injectable()
export class SubscriptionService {
  private readonly plans: Record<SubscriptionPlan, SubscriptionPlanDetails> = {
    FREE: {
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: {
        maxProperties: 2,
        maxProducts: 5,
        maxProjects: 1,
        canReceiveLeads: false,
        canAccessAnalytics: false,
        prioritySupport: false,
      },
    },
    BASIC: {
      name: 'Basic',
      monthlyPrice: 10,
      yearlyPrice: 100,
      features: {
        maxProperties: 10,
        maxProducts: 50,
        maxProjects: 5,
        canReceiveLeads: true,
        canAccessAnalytics: false,
        prioritySupport: false,
      },
    },
    PRO: {
      name: 'Professional',
      monthlyPrice: 30,
      yearlyPrice: 300,
      features: {
        maxProperties: 50,
        maxProducts: 200,
        maxProjects: 20,
        canReceiveLeads: true,
        canAccessAnalytics: true,
        prioritySupport: false,
      },
    },
    ENTERPRISE: {
      name: 'Enterprise',
      monthlyPrice: 100,
      yearlyPrice: 1000,
      features: {
        maxProperties: -1, // Unlimited
        maxProducts: -1,
        maxProjects: -1,
        canReceiveLeads: true,
        canAccessAnalytics: true,
        prioritySupport: true,
      },
    },
  };

  constructor(
    private prisma: PrismaService,
    private paynowService: PaynowService,
  ) {}

  /**
   * Get available subscription plans
   */
  getAvailablePlans() {
    return Object.entries(this.plans).map(([key, details]) => ({
      plan: key as SubscriptionPlan,
      ...details,
    }));
  }

  /**
   * Get user's current subscription
   */
  async getUserSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['ACTIVE', 'EXPIRED'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      // Return default FREE subscription
      return {
        plan: 'FREE',
        status: 'ACTIVE',
        ...this.plans.FREE.features,
      };
    }

    return subscription;
  }

  /**
   * Create a new subscription
   */
  async createSubscription(
    userId: string,
    plan: SubscriptionPlan,
    billingCycle: 'MONTHLY' | 'YEARLY',
    paymentMethod: 'PAYNOW' | 'STRIPE',
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const planDetails = this.plans[plan];
    const amount = billingCycle === 'MONTHLY' ? planDetails.monthlyPrice : planDetails.yearlyPrice;

    if (amount === 0) {
      throw new BadRequestException('Free plan does not require payment');
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    const nextBillingDate = new Date();

    if (billingCycle === 'MONTHLY') {
      endDate.setMonth(endDate.getMonth() + 1);
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }

    // Create subscription
    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        plan,
        status: 'ACTIVE', // Will be PENDING until payment
        amount,
        currency: 'USD',
        billingCycle,
        startDate,
        endDate,
        nextBillingDate,
        ...planDetails.features,
      },
    });

    // Generate invoice
    const invoice = await this.createInvoice(subscription.id, userId, amount);

    // Initiate payment if Paynow
    if (paymentMethod === 'PAYNOW' && this.paynowService.isConfigured()) {
      const paymentResult = await this.paynowService.initiatePayment({
        amount,
        reference: invoice.invoiceNumber,
        email: user.email,
        phone: user.phone || '',
        returnUrl: `${process.env.FRONTEND_URL}/subscriptions/payment/callback`,
        resultUrl: `${process.env.BACKEND_URL}/api/subscriptions/paynow/webhook`,
        additionalInfo: `${planDetails.name} Subscription - ${billingCycle}`,
      });

      if (paymentResult.success) {
        // Update invoice with Paynow details
        await this.prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            paynowPollUrl: paymentResult.pollUrl,
            paymentMethod: 'PAYNOW',
          },
        });

        return {
          subscription,
          invoice,
          payment: paymentResult,
        };
      }
    }

    return {
      subscription,
      invoice,
    };
  }

  /**
   * Create invoice for subscription
   */
  private async createInvoice(subscriptionId: string, userId: string, amount: number) {
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // 7 days to pay

    return this.prisma.invoice.create({
      data: {
        subscriptionId,
        userId,
        invoiceNumber,
        amount,
        currency: 'USD',
        status: 'PENDING',
        dueDate,
        items: [
          {
            description: 'Subscription Payment',
            amount,
          },
        ],
      },
    });
  }

  /**
   * Process Paynow webhook callback
   */
  async processPaynowCallback(data: Record<string, string>) {
    const reference = data.reference;
    const status = data.paynowreference;
    const hash = data.hash;

    // Verify hash
    if (!this.paynowService.verifyHash(data, hash)) {
      throw new BadRequestException('Invalid payment hash');
    }

    // Find invoice
    const invoice = await this.prisma.invoice.findFirst({
      where: { invoiceNumber: reference },
      include: { subscription: true },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Update invoice and subscription based on payment status
    if (status.toLowerCase() === 'paid') {
      await this.prisma.$transaction([
        this.prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            status: 'PAID',
            paidDate: new Date(),
            paymentId: data.paynowreference,
          },
        }),
        this.prisma.subscription.update({
          where: { id: invoice.subscriptionId },
          data: {
            status: 'ACTIVE',
            lastPaymentDate: new Date(),
          },
        }),
      ]);
    }

    return { success: true };
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string, subscriptionId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELLED',
        autoRenew: false,
        cancelledAt: new Date(),
      },
    });
  }

  /**
   * Check subscription limits
   */
  async checkLimit(userId: string, limitType: 'properties' | 'products' | 'projects'): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);

    let currentCount = 0;
    let maxAllowed = 0;

    switch (limitType) {
      case 'properties':
        currentCount = await this.prisma.property.count({ where: { ownerId: userId } });
        maxAllowed = subscription.maxProperties || 0;
        break;
      case 'products':
        const supplier = await this.prisma.supplier.findUnique({ where: { userId } });
        if (supplier) {
          currentCount = await this.prisma.product.count({ where: { supplierId: supplier.id } });
        }
        maxAllowed = subscription.maxProducts || 0;
        break;
      case 'projects':
        currentCount = await this.prisma.project.count({ where: { clientId: userId } });
        maxAllowed = subscription.maxProjects || 0;
        break;
    }

    // -1 means unlimited
    if (maxAllowed === -1) return true;

    return currentCount < maxAllowed;
  }
}
