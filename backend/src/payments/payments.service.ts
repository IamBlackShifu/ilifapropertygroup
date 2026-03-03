import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Paynow } from 'paynow';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus, PaymentMethod, Prisma } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private paynow: any;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    // Initialize Paynow with Stamcor credentials
    this.paynow = new Paynow(
      '18639', // Integration ID
      'fb41826a-b482-4380-a25b-349a540f2369', // Integration Key
    );

    // Set return and result URLs
    this.paynow.resultUrl = process.env.PAYNOW_RESULT_URL || 'http://localhost:4000/api/payments/paynow/callback';
    this.paynow.returnUrl = process.env.PAYNOW_RETURN_URL || 'http://localhost:3000/payments/return';
  }

  // Create a payment record
  async createPayment(data: {
    payerId: string;
    recipientId?: string;
    amount: number;
    currency: string;
    description: string;
    relatedEntityType: string;
    relatedEntityId: string;
    paymentMethod: PaymentMethod;
    metadata?: any;
  }) {
    return this.prisma.payment.create({
      data: {
        ...data,
        amount: new Prisma.Decimal(data.amount),
        status: PaymentStatus.PENDING,
      },
      include: {
        payer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  // Initialize Paynow payment
  async initiatePaynowPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        payer: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment already processed');
    }

    try {
      // Create a Paynow payment
      const paynowPayment = this.paynow.createPayment(
        `Payment-${payment.id}`,
        payment.payer.email,
      );

      // Add items to payment
      paynowPayment.add(
        payment.description || 'ILifa Property Group Payment',
        Number(payment.amount),
      );

      // Send payment to Paynow
      const response = await this.paynow.send(paynowPayment);

      if (response.success) {
        // Update payment with Paynow details
        await this.prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: PaymentStatus.PROCESSING,
            paymentProvider: 'PAYNOW',
            providerPaymentId: response.data.pollurl,
            metadata: {
              pollUrl: response.data.pollurl,
              redirectUrl: response.data.redirect,
              hash: response.data.hash,
            },
          },
        });

        // Create transaction record
        await this.prisma.transaction.create({
          data: {
            paymentId: payment.id,
            transactionType: 'CHARGE',
            amount: payment.amount,
            currency: payment.currency,
            providerTxId: response.data.pollurl,
            status: 'PENDING',
          },
        });

        return {
          success: true,
          pollUrl: response.data.pollurl,
          redirectUrl: response.data.redirect,
          instructions: response.instructions,
        };
      } else {
        throw new BadRequestException(response.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Paynow payment error:', error);
      throw new BadRequestException('Failed to process payment');
    }
  }

  // Check Paynow payment status
  async checkPaynowStatus(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (!payment.providerPaymentId) {
      throw new BadRequestException('Payment not initialized with Paynow');
    }

    try {
      const status = await this.paynow.pollTransaction(payment.providerPaymentId);

      let paymentStatus: PaymentStatus;
      let transactionStatus: 'PENDING' | 'SUCCESS' | 'FAILED';

      if (status.paid) {
        paymentStatus = PaymentStatus.COMPLETED;
        transactionStatus = 'SUCCESS';
      } else if (status.status === 'Cancelled' || status.status === 'Failed') {
        paymentStatus = PaymentStatus.FAILED;
        transactionStatus = 'FAILED';
      } else {
        paymentStatus = PaymentStatus.PROCESSING;
        transactionStatus = 'PENDING';
      }

      // Update payment status
      await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: paymentStatus,
          completedAt: status.paid ? new Date() : null,
        },
      });

      // Update transaction
      const transaction = await this.prisma.transaction.findFirst({
        where: { paymentId: payment.id },
      });

      if (transaction) {
        await this.prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: transactionStatus,
            processedAt: status.paid ? new Date() : null,
          },
        });
      }

      // Create notification if completed
      if (status.paid && payment.status !== PaymentStatus.COMPLETED) {
        await this.prisma.notification.create({
          data: {
            userId: payment.payerId,
            type: 'SUCCESS',
            category: 'PAYMENT',
            title: 'Payment Successful',
            message: `Your payment of $${payment.amount} has been processed successfully`,
            linkUrl: `/payments/${paymentId}`,
          },
        });

        // Notify recipient if exists
        if (payment.recipientId) {
          await this.prisma.notification.create({
            data: {
              userId: payment.recipientId,
              type: 'SUCCESS',
              category: 'PAYMENT',
              title: 'Payment Received',
              message: `You received a payment of $${payment.amount}`,
              linkUrl: `/payments/${paymentId}`,
            },
          });
        }
      }

      return {
        status: status.status,
        paid: status.paid,
        amount: status.amount,
        reference: status.reference,
      };
    } catch (error) {
      console.error('Error checking Paynow status:', error);
      throw new BadRequestException('Failed to check payment status');
    }
  }

  // Handle Paynow callback
  async handlePaynowCallback(data: any) {
    const { reference, paynowreference, pollurl, status } = data;

    // Find payment by poll URL
    const payment = await this.prisma.payment.findFirst({
      where: {
        providerPaymentId: pollurl,
      },
    });

    if (!payment) {
      console.error('Payment not found for callback:', pollurl);
      return;
    }

    let paymentStatus: PaymentStatus;
    let transactionStatus: 'PENDING' | 'SUCCESS' | 'FAILED';

    if (status === 'Paid') {
      paymentStatus = PaymentStatus.COMPLETED;
      transactionStatus = 'SUCCESS';
    } else if (status === 'Cancelled' || status === 'Failed') {
      paymentStatus = PaymentStatus.FAILED;
      transactionStatus = 'FAILED';
    } else {
      paymentStatus = PaymentStatus.PROCESSING;
      transactionStatus = 'PENDING';
    }

    // Update payment
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: paymentStatus,
        completedAt: status === 'Paid' ? new Date() : null,
        metadata: {
          ...((payment.metadata as any) || {}),
          paynowReference: paynowreference,
          callbackStatus: status,
        },
      },
    });

    // Update transaction
    const transaction = await this.prisma.transaction.findFirst({
      where: { paymentId: payment.id },
    });

    if (transaction) {
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: transactionStatus,
          processedAt: status === 'Paid' ? new Date() : null,
          providerTxId: paynowreference,
        },
      });
    }

    // Send notifications
    if (status === 'Paid') {
      await this.prisma.notification.create({
        data: {
          userId: payment.payerId,
          type: 'SUCCESS',
          category: 'PAYMENT',
          title: 'Payment Successful',
          message: `Your payment of $${payment.amount} has been processed successfully`,
          linkUrl: `/payments/${payment.id}`,
        },
      });

      if (payment.recipientId) {
        await this.prisma.notification.create({
          data: {
            userId: payment.recipientId,
            type: 'SUCCESS',
            category: 'PAYMENT',
            title: 'Payment Received',
            message: `You received a payment of $${payment.amount}`,
            linkUrl: `/payments/${payment.id}`,
          },
        });
      }
    }

    return { success: true };
  }

  // Get payment by ID
  async getPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        payer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        transactions: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  // Get user's payments
  async getUserPayments(userId: string, type: 'sent' | 'received' = 'sent') {
    const where = type === 'sent' ? { payerId: userId } : { recipientId: userId };

    return this.prisma.payment.findMany({
      where,
      include: {
        payer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Process milestone payment
  async processMilestonePayment(projectId: string, milestoneId: string, payerId: string) {
    const milestone = await this.prisma.projectMilestone.findUnique({
      where: { id: milestoneId },
      include: {
        project: {
          include: {
            client: true,
          },
        },
      },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (milestone.isPaid) {
      throw new BadRequestException('Milestone already paid');
    }

    if (milestone.project.clientId !== payerId) {
      throw new BadRequestException('Only project client can make milestone payments');
    }

    // Create payment
    const payment = await this.createPayment({
      payerId,
      amount: Number(milestone.amount),
      currency: milestone.currency,
      description: `Milestone Payment: ${milestone.title}`,
      relatedEntityType: 'PROJECT_MILESTONE',
      relatedEntityId: milestoneId,
      paymentMethod: 'PAYNOW',
      metadata: {
        projectId,
        milestoneId,
      },
    });

    return payment;
  }

  // Complete milestone payment
  async completeMilestonePayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment not completed');
    }

    const metadata = payment.metadata as any;
    if (!metadata?.milestoneId) {
      throw new BadRequestException('Invalid payment metadata');
    }

    // Update milestone
    await this.prisma.projectMilestone.update({
      where: { id: metadata.milestoneId },
      data: {
        isPaid: true,
        paidDate: new Date(),
      },
    });

    return { success: true };
  }
}
