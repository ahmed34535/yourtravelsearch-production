/**
 * Duffel Payment Processor
 * 
 * Production-ready integration with Duffel's payment system,
 * following enterprise security standards and error handling patterns.
 */

import {
  PaymentProcessor,
  PaymentIntent,
  PaymentMethod,
  PaymentResult,
  ProcessorConfig,
  CreatePaymentIntentParams,
  ThreeDSecureParams,
  ThreeDSecureResult,
  RefundResult,
  PaymentError
} from '../types';

export class DuffelPaymentProcessor implements PaymentProcessor {
  public readonly name = 'duffel';
  private config: ProcessorConfig | null = null;
  private baseUrl: string = '';

  async initialize(config: ProcessorConfig): Promise<void> {
    this.validateConfig(config);
    this.config = config;
    this.baseUrl = config.environment === 'production' 
      ? 'https://api.duffel.com' 
      : 'https://api.duffel.com'; // Duffel uses same URL for both
    
    await this.validateConnection();
  }

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent> {
    this.ensureInitialized();

    const requestPayload = {
      amount: params.amount,
      currency: params.currency.toUpperCase(),
      payment_method_types: params.payment_method_types,
      confirmation_method: params.confirmation_method || 'automatic',
      capture_method: params.capture_method || 'automatic',
      metadata: {
        ...params.metadata,
        processor: 'duffel',
        environment: this.config!.environment
      }
    };

    try {
      const response = await this.makeRequest('POST', '/payments/payment_intents', requestPayload);
      return this.transformPaymentIntent(response.data);
    } catch (error) {
      throw this.handleApiError(error, 'CREATE_PAYMENT_INTENT');
    }
  }

  async confirmPayment(intentId: string, paymentMethod: PaymentMethod): Promise<PaymentResult> {
    this.ensureInitialized();

    const requestPayload = {
      payment_method: {
        id: paymentMethod.id,
        type: paymentMethod.type,
        metadata: paymentMethod.metadata
      },
      return_url: this.getReturnUrl()
    };

    try {
      const response = await this.makeRequest(
        'POST', 
        `/payments/payment_intents/${intentId}/confirm`, 
        requestPayload
      );

      const intent = this.transformPaymentIntent(response.data);
      
      return {
        success: intent.status === 'succeeded',
        payment_intent: intent,
        requires_action: intent.status === 'requires_action',
        next_action: response.data.next_action ? {
          type: response.data.next_action.type,
          redirect_to_url: response.data.next_action.redirect_to_url
        } : undefined
      };
    } catch (error) {
      const paymentError = this.handleApiError(error, 'CONFIRM_PAYMENT');
      return {
        success: false,
        payment_intent: await this.getPaymentIntent(intentId),
        error: paymentError
      };
    }
  }

  async handle3DSecure(params: ThreeDSecureParams): Promise<ThreeDSecureResult> {
    this.ensureInitialized();

    try {
      const response = await this.makeRequest('POST', '/payments/3ds/authenticate', {
        payment_intent_id: params.payment_intent_id,
        return_url: params.return_url
      });

      return {
        authenticated: response.data.status === 'authenticated',
        status: this.map3DSStatus(response.data.status),
        challenge_url: response.data.challenge_url,
        transaction_id: response.data.transaction_id
      };
    } catch (error) {
      throw this.handleApiError(error, 'THREEDS_AUTHENTICATION');
    }
  }

  async capturePayment(intentId: string, amount?: number): Promise<PaymentResult> {
    this.ensureInitialized();

    const requestPayload = amount ? { amount_to_capture: amount } : {};

    try {
      const response = await this.makeRequest(
        'POST', 
        `/payments/payment_intents/${intentId}/capture`, 
        requestPayload
      );

      const intent = this.transformPaymentIntent(response.data);
      
      return {
        success: intent.status === 'succeeded',
        payment_intent: intent
      };
    } catch (error) {
      const paymentError = this.handleApiError(error, 'CAPTURE_PAYMENT');
      return {
        success: false,
        payment_intent: await this.getPaymentIntent(intentId),
        error: paymentError
      };
    }
  }

  async refundPayment(intentId: string, amount?: number): Promise<RefundResult> {
    this.ensureInitialized();

    const requestPayload = {
      payment_intent: intentId,
      ...(amount && { amount })
    };

    try {
      const response = await this.makeRequest('POST', '/payments/refunds', requestPayload);
      
      return {
        success: true,
        refund_id: response.data.id,
        amount: response.data.amount,
        currency: response.data.currency,
        status: response.data.status
      };
    } catch (error) {
      const paymentError = this.handleApiError(error, 'REFUND_PAYMENT');
      return {
        success: false,
        refund_id: '',
        amount: amount || 0,
        currency: 'USD',
        status: 'failed',
        error: paymentError
      };
    }
  }

  private async getPaymentIntent(intentId: string): Promise<PaymentIntent> {
    try {
      const response = await this.makeRequest('GET', `/payments/payment_intents/${intentId}`);
      return this.transformPaymentIntent(response.data);
    } catch (error) {
      throw this.handleApiError(error, 'GET_PAYMENT_INTENT');
    }
  }

  private async makeRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<{ data: any; status: number }> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.config!.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Duffel-Version': 'v1'
    };

    const requestConfig: RequestInit = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) })
    };

    const response = await fetch(url, requestConfig);
    const responseData = await response.json();

    if (!response.ok) {
      throw new DuffelApiError(response.status, responseData);
    }

    return { data: responseData, status: response.status };
  }

  private transformPaymentIntent(data: any): PaymentIntent {
    return {
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      status: this.mapPaymentStatus(data.status),
      client_secret: data.client_secret,
      confirmation_method: data.confirmation_method,
      capture_method: data.capture_method,
      metadata: data.metadata || {},
      created_at: data.created,
      updated_at: data.updated || data.created
    };
  }

  private mapPaymentStatus(duffelStatus: string): any {
    const statusMap: Record<string, any> = {
      'requires_payment_method': 'requires_payment_method',
      'requires_confirmation': 'requires_confirmation',
      'requires_action': 'requires_action',
      'processing': 'processing',
      'requires_capture': 'requires_capture',
      'canceled': 'canceled',
      'succeeded': 'succeeded'
    };

    return statusMap[duffelStatus] || duffelStatus;
  }

  private map3DSStatus(duffelStatus: string): any {
    const statusMap: Record<string, any> = {
      'authenticated': '3ds_success',
      'failed': '3ds_failed',
      'not_required': '3ds_not_required',
      'challenge_required': '3ds_challenge'
    };

    return statusMap[duffelStatus] || '3ds_failed';
  }

  private handleApiError(error: any, context: string): PaymentError {
    if (error instanceof DuffelApiError) {
      return {
        code: error.code || 'API_ERROR',
        message: error.message,
        type: this.categorizeErrorType(error.code),
        decline_code: error.decline_code
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: `${context}: ${error.message || 'Unknown error'}`,
      type: 'api_error'
    };
  }

  private categorizeErrorType(code: string): any {
    if (code.includes('card') || code.includes('payment_method')) {
      return 'card_error';
    }
    if (code.includes('auth') || code.includes('key')) {
      return 'authentication_error';
    }
    if (code.includes('validation') || code.includes('invalid')) {
      return 'validation_error';
    }
    return 'api_error';
  }

  private validateConfig(config: ProcessorConfig): void {
    if (!config.apiKey) {
      throw new Error('Duffel API key is required');
    }
    if (!config.environment) {
      throw new Error('Environment configuration is required');
    }
  }

  private async validateConnection(): Promise<void> {
    try {
      await this.makeRequest('GET', '/identity');
    } catch (error) {
      throw new Error(`Failed to connect to Duffel API: ${error}`);
    }
  }

  private ensureInitialized(): void {
    if (!this.config) {
      throw new Error('DuffelPaymentProcessor not initialized');
    }
  }

  private getReturnUrl(): string {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://app.example.com'; // fallback for server-side
    
    return `${baseUrl}/payment/complete`;
  }
}

class DuffelApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly response: any
  ) {
    super(response.message || `Duffel API Error: ${status}`);
    this.name = 'DuffelApiError';
  }

  get code(): string {
    return this.response.code || this.response.type || 'api_error';
  }

  get decline_code(): string | undefined {
    return this.response.decline_code;
  }
}