/**
 * Core Payment Service
 * 
 * Enterprise-grade payment processing abstraction layer following
 * PCI DSS compliance and industry best practices.
 */

import { 
  PaymentIntent, 
  PaymentMethod, 
  PaymentResult, 
  PaymentProcessor,
  CreatePaymentIntentParams,
  PaymentError,
  ThreeDSecureResult,
  RefundResult
} from '../types';

export class PaymentService {
  private processor: PaymentProcessor | null = null;
  private isInitialized = false;

  constructor(private readonly config: PaymentServiceConfig) {
    this.validateConfig(config);
  }

  /**
   * Initialize payment service with selected processor
   */
  async initialize(processor: PaymentProcessor): Promise<void> {
    try {
      const processorConfig = {
        ...this.config.processorConfig,
        environment: this.config.environment
      };
      await processor.initialize(processorConfig);
      this.processor = processor;
      this.isInitialized = true;
    } catch (error) {
      throw new PaymentServiceError(
        'INITIALIZATION_FAILED',
        'Failed to initialize payment processor',
        error
      );
    }
  }

  /**
   * Create payment intent with comprehensive validation
   */
  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent> {
    this.ensureInitialized();
    this.validatePaymentParams(params);

    try {
      const intent = await this.processor!.createPaymentIntent(params);
      this.logPaymentEvent('payment_intent_created', { intent_id: intent.id });
      return intent;
    } catch (error) {
      this.logPaymentError('payment_intent_creation_failed', error);
      throw this.handlePaymentError(error);
    }
  }

  /**
   * Process payment with 3DS support
   */
  async processPayment(
    intentId: string, 
    paymentMethod: PaymentMethod
  ): Promise<PaymentResult> {
    this.ensureInitialized();
    this.validatePaymentMethod(paymentMethod);

    try {
      const result = await this.processor!.confirmPayment(intentId, paymentMethod);
      
      if (result.requires_action && result.next_action?.type === 'redirect_to_url') {
        // Handle 3DS challenge
        const threeDSResult = await this.handle3DSecure(intentId, result.next_action.redirect_to_url!.return_url);
        if (!threeDSResult.authenticated) {
          throw new PaymentServiceError(
            'AUTHENTICATION_FAILED',
            '3D Secure authentication failed'
          );
        }
      }

      this.logPaymentEvent('payment_processed', { 
        intent_id: intentId, 
        status: result.payment_intent.status 
      });
      
      return result;
    } catch (error) {
      this.logPaymentError('payment_processing_failed', error, { intent_id: intentId });
      throw this.handlePaymentError(error);
    }
  }

  /**
   * Handle 3D Secure authentication
   */
  private async handle3DSecure(intentId: string, returnUrl: string): Promise<ThreeDSecureResult> {
    try {
      return await this.processor!.handle3DSecure({
        payment_intent_id: intentId,
        return_url: returnUrl
      });
    } catch (error) {
      this.logPaymentError('3ds_handling_failed', error, { intent_id: intentId });
      throw new PaymentServiceError(
        'THREEDS_FAILED',
        '3D Secure processing failed',
        error
      );
    }
  }

  /**
   * Refund payment with validation
   */
  async refundPayment(intentId: string, amount?: number): Promise<RefundResult> {
    this.ensureInitialized();

    try {
      const result = await this.processor!.refundPayment(intentId, amount);
      this.logPaymentEvent('payment_refunded', { 
        intent_id: intentId, 
        refund_id: result.refund_id,
        amount: result.amount 
      });
      return result;
    } catch (error) {
      this.logPaymentError('refund_failed', error, { intent_id: intentId });
      throw this.handlePaymentError(error);
    }
  }

  /**
   * Capture authorized payment
   */
  async capturePayment(intentId: string, amount?: number): Promise<PaymentResult> {
    this.ensureInitialized();

    try {
      const result = await this.processor!.capturePayment(intentId, amount);
      this.logPaymentEvent('payment_captured', { 
        intent_id: intentId, 
        amount: amount || result.payment_intent.amount 
      });
      return result;
    } catch (error) {
      this.logPaymentError('capture_failed', error, { intent_id: intentId });
      throw this.handlePaymentError(error);
    }
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: PaymentServiceConfig): void {
    if (!config.environment || !['sandbox', 'production'].includes(config.environment)) {
      throw new PaymentServiceError(
        'INVALID_CONFIG',
        'Invalid environment configuration'
      );
    }

    if (!config.currency || config.currency.length !== 3) {
      throw new PaymentServiceError(
        'INVALID_CONFIG',
        'Invalid currency code'
      );
    }
  }

  /**
   * Validate payment parameters
   */
  private validatePaymentParams(params: CreatePaymentIntentParams): void {
    if (!params.amount || params.amount <= 0) {
      throw new PaymentServiceError(
        'INVALID_AMOUNT',
        'Amount must be greater than zero'
      );
    }

    if (!params.currency || params.currency.length !== 3) {
      throw new PaymentServiceError(
        'INVALID_CURRENCY',
        'Invalid currency code'
      );
    }

    if (!params.metadata?.booking_type) {
      throw new PaymentServiceError(
        'MISSING_METADATA',
        'Booking type is required in metadata'
      );
    }
  }

  /**
   * Validate payment method
   */
  private validatePaymentMethod(paymentMethod: PaymentMethod): void {
    if (!paymentMethod.id || !paymentMethod.type) {
      throw new PaymentServiceError(
        'INVALID_PAYMENT_METHOD',
        'Payment method ID and type are required'
      );
    }
  }

  /**
   * Ensure service is initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized || !this.processor) {
      throw new PaymentServiceError(
        'NOT_INITIALIZED',
        'Payment service not initialized'
      );
    }
  }

  /**
   * Handle payment errors with proper categorization
   */
  private handlePaymentError(error: any): PaymentServiceError {
    if (error instanceof PaymentServiceError) {
      return error;
    }

    // Categorize external errors
    const errorType = this.categorizeError(error);
    return new PaymentServiceError(
      errorType.code,
      errorType.message,
      error
    );
  }

  /**
   * Categorize external errors
   */
  private categorizeError(error: any): { code: string; message: string } {
    const message = error.message || 'Unknown payment error';
    
    if (message.includes('card')) {
      return { code: 'CARD_ERROR', message: 'Card processing error' };
    }
    
    if (message.includes('insufficient') || message.includes('declined')) {
      return { code: 'PAYMENT_DECLINED', message: 'Payment was declined' };
    }
    
    if (message.includes('network') || message.includes('timeout')) {
      return { code: 'NETWORK_ERROR', message: 'Network connectivity issue' };
    }
    
    return { code: 'PROCESSING_ERROR', message: 'Payment processing error' };
  }

  /**
   * Log payment events for audit trail
   */
  private logPaymentEvent(event: string, data: Record<string, any>): void {
    if (this.config.enableLogging) {
      console.log(`[PaymentService] ${event}:`, {
        timestamp: new Date().toISOString(),
        event,
        ...data
      });
    }
  }

  /**
   * Log payment errors with context
   */
  private logPaymentError(event: string, error: any, context?: Record<string, any>): void {
    if (this.config.enableLogging) {
      console.error(`[PaymentService] ${event}:`, {
        timestamp: new Date().toISOString(),
        event,
        error: error.message || error,
        context
      });
    }
  }
}

export interface PaymentServiceConfig {
  environment: 'sandbox' | 'production';
  currency: string;
  enableLogging: boolean;
  processorConfig: {
    apiKey: string;
    webhookSecret?: string;
  };
}

export class PaymentServiceError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly originalError?: any
  ) {
    super(message);
    this.name = 'PaymentServiceError';
  }
}