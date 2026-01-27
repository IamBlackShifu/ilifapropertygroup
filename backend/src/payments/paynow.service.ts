import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

export interface PaynowPaymentRequest {
  amount: number;
  reference: string;
  email: string;
  phone?: string;
  returnUrl: string;
  resultUrl: string;
  additionalInfo?: string;
}

export interface PaynowPaymentResponse {
  success: boolean;
  pollUrl?: string;
  redirectUrl?: string;
  hash?: string;
  error?: string;
  instructions?: string;
}

export interface PaynowStatusResponse {
  status: 'Paid' | 'Awaiting Delivery' | 'Delivered' | 'Cancelled' | 'Created' | 'Sent' | 'Failed';
  amount: number;
  reference: string;
  paynowreference?: string;
  pollurl?: string;
  hash?: string;
}

@Injectable()
export class PaynowService {
  private readonly logger = new Logger(PaynowService.name);
  private readonly apiUrl = 'https://www.paynow.co.zw/interface/initiatetransaction';
  private readonly integrationId: string;
  private readonly integrationKey: string;

  constructor(private configService: ConfigService) {
    this.integrationId = this.configService.get<string>('PAYNOW_INTEGRATION_ID') || '';
    this.integrationKey = this.configService.get<string>('PAYNOW_INTEGRATION_KEY') || '';

    if (!this.integrationId || !this.integrationKey) {
      this.logger.warn('Paynow credentials not configured. Payment processing will not work.');
    }
  }

  /**
   * Initiate a payment with Paynow
   */
  async initiatePayment(request: PaynowPaymentRequest): Promise<PaynowPaymentResponse> {
    try {
      // Build payment request data
      const data = this.buildPaymentData(request);

      this.logger.log(`Initiating Paynow payment: ${request.reference}`);

      // Send request to Paynow
      const response = await axios.post(this.apiUrl, new URLSearchParams(data).toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Parse Paynow response
      const result = this.parsePaynowResponse(response.data);

      if (result.status?.toLowerCase() === 'ok' || result.status?.toLowerCase() === 'ok sent') {
        return {
          success: true,
          pollUrl: result.pollurl,
          redirectUrl: result.browserurl,
          hash: result.hash,
          instructions: result.status,
        };
      } else {
        this.logger.error(`Paynow payment failed: ${result.error || 'Unknown error'}`);
        return {
          success: false,
          error: result.error || 'Payment initialization failed',
        };
      }
    } catch (error) {
      this.logger.error(`Paynow API error: ${error.message}`, error.stack);
      return {
        success: false,
        error: 'Failed to communicate with payment gateway',
      };
    }
  }

  /**
   * Check payment status using poll URL
   */
  async checkPaymentStatus(pollUrl: string): Promise<PaynowStatusResponse> {
    try {
      this.logger.log(`Checking payment status: ${pollUrl}`);

      const response = await axios.post(pollUrl);
      const result = this.parsePaynowResponse(response.data);

      return {
        status: result.status as any,
        amount: parseFloat(result.amount || '0'),
        reference: result.reference || '',
        paynowreference: result.paynowreference,
        pollurl: result.pollurl,
        hash: result.hash,
      };
    } catch (error) {
      this.logger.error(`Failed to check payment status: ${error.message}`);
      throw new BadRequestException('Failed to check payment status');
    }
  }

  /**
   * Build payment data for Paynow request
   */
  private buildPaymentData(request: PaynowPaymentRequest): Record<string, string> {
    const data: Record<string, string> = {
      id: this.integrationId,
      reference: request.reference,
      amount: request.amount.toFixed(2),
      additionalinfo: request.additionalInfo || request.reference,
      returnurl: request.returnUrl,
      resulturl: request.resultUrl,
      authemail: request.email,
      status: 'Message',
    };

    // Add phone if provided (for mobile money)
    if (request.phone) {
      data.phone = request.phone;
    }

    // Generate hash
    const hash = this.generateHash(data);
    data.hash = hash;

    return data;
  }

  /**
   * Generate SHA512 hash for request verification
   */
  private generateHash(data: Record<string, string>): string {
    // Create values string in the required format
    const values = [
      data.id,
      data.reference,
      data.amount,
      data.additionalinfo,
      data.returnurl,
      data.resulturl,
      data.authemail,
      data.status,
      this.integrationKey, // Integration key is added last
    ].join('');

    return crypto.createHash('sha512').update(values).digest('hex').toUpperCase();
  }

  /**
   * Verify hash from Paynow response
   */
  verifyHash(data: Record<string, string>, receivedHash: string): boolean {
    const values = Object.keys(data)
      .filter(key => key !== 'hash')
      .sort()
      .map(key => data[key])
      .join('');

    const calculatedHash = crypto
      .createHash('sha512')
      .update(values + this.integrationKey)
      .digest('hex')
      .toUpperCase();

    return calculatedHash === receivedHash;
  }

  /**
   * Parse Paynow response format (key=value pairs separated by &)
   */
  private parsePaynowResponse(responseText: string): Record<string, string> {
    const result: Record<string, string> = {};

    responseText.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value) {
        result[key.toLowerCase()] = decodeURIComponent(value);
      }
    });

    return result;
  }

  /**
   * Check if Paynow is configured
   */
  isConfigured(): boolean {
    return !!(this.integrationId && this.integrationKey);
  }
}
