/**
 * Payment Service Factory
 * 
 * Central factory for creating and configuring payment services
 * with complete isolation from the main demo application.
 */

import { PaymentService, PaymentServiceConfig } from './core/PaymentService';
import { DuffelPaymentProcessor } from './duffel/DuffelPaymentProcessor';
import { ThreeDSecureHandler, ThreeDSecureConfig } from './security/ThreeDSecureHandler';
import { PaymentProcessor } from './types';

export class PaymentServiceFactory {
  private static instance: PaymentServiceFactory | null = null;
  private paymentService: PaymentService | null = null;
  private threeDSHandler: ThreeDSecureHandler | null = null;

  private constructor() {}

  static getInstance(): PaymentServiceFactory {
    if (!PaymentServiceFactory.instance) {
      PaymentServiceFactory.instance = new PaymentServiceFactory();
    }
    return PaymentServiceFactory.instance;
  }

  /**
   * Create a new payment service instance
   */
  async createPaymentService(config: PaymentServiceConfig): Promise<PaymentService> {
    const service = new PaymentService(config);
    
    // Initialize with Duffel processor by default
    const processor = this.createDuffelProcessor();
    await service.initialize(processor);
    
    this.paymentService = service;
    return service;
  }

  /**
   * Create Duffel payment processor
   */
  createDuffelProcessor(): PaymentProcessor {
    return new DuffelPaymentProcessor();
  }

  /**
   * Create 3D Secure handler
   */
  create3DSecureHandler(config: ThreeDSecureConfig): ThreeDSecureHandler {
    this.threeDSHandler = new ThreeDSecureHandler(config);
    return this.threeDSHandler;
  }

  /**
   * Get configured payment service
   */
  getPaymentService(): PaymentService | null {
    return this.paymentService;
  }

  /**
   * Get 3D Secure handler
   */
  get3DSecureHandler(): ThreeDSecureHandler | null {
    return this.threeDSHandler;
  }

  /**
   * Check if payment services are ready
   */
  isReady(): boolean {
    return this.paymentService !== null;
  }

  /**
   * Reset all services (useful for testing)
   */
  reset(): void {
    this.paymentService = null;
    this.threeDSHandler = null;
  }

  /**
   * Create default configuration for development
   */
  static createDevelopmentConfig(apiKey?: string): PaymentServiceConfig {
    return {
      environment: 'sandbox',
      currency: 'USD',
      enableLogging: true,
      processorConfig: {
        apiKey: apiKey || 'test_api_key',
        webhookSecret: 'test_webhook_secret'
      }
    };
  }

  /**
   * Create production configuration
   */
  static createProductionConfig(apiKey: string, webhookSecret: string): PaymentServiceConfig {
    return {
      environment: 'production',
      currency: 'USD',
      enableLogging: false,
      processorConfig: {
        apiKey,
        webhookSecret
      }
    };
  }

  /**
   * Create default 3DS configuration
   */
  static createDefault3DSConfig(): ThreeDSecureConfig {
    return {
      merchantId: 'MERCHANT_001',
      acquirerBin: '123456',
      merchantCategoryCode: '5999',
      merchantName: 'TravelHub',
      threeDSRequestorUrl: typeof window !== 'undefined' ? window.location.origin : 'https://app.example.com',
      challengeWindowSize: '03'
    };
  }
}

/**
 * Convenience function to initialize payment services
 */
export async function initializePaymentServices(config?: {
  apiKey?: string;
  environment?: 'sandbox' | 'production';
  enableLogging?: boolean;
}): Promise<{
  paymentService: PaymentService;
  threeDSHandler: ThreeDSecureHandler;
}> {
  const factory = PaymentServiceFactory.getInstance();
  
  const paymentConfig = config?.environment === 'production' && config.apiKey
    ? PaymentServiceFactory.createProductionConfig(config.apiKey, '')
    : PaymentServiceFactory.createDevelopmentConfig(config?.apiKey);
  
  if (config?.enableLogging !== undefined) {
    paymentConfig.enableLogging = config.enableLogging;
  }

  const paymentService = await factory.createPaymentService(paymentConfig);
  const threeDSHandler = factory.create3DSecureHandler(
    PaymentServiceFactory.createDefault3DSConfig()
  );

  return {
    paymentService,
    threeDSHandler
  };
}

/**
 * Check if live payment integration is available
 */
export function isLivePaymentAvailable(): boolean {
  // Check for API keys in environment
  const hasApiKey = typeof process !== 'undefined' 
    ? process.env.DUFFEL_API_KEY 
    : false;
  
  return !!hasApiKey;
}

/**
 * Get payment integration status
 */
export function getPaymentIntegrationStatus(): {
  mode: 'demo' | 'live';
  ready: boolean;
  processor: string;
} {
  const factory = PaymentServiceFactory.getInstance();
  const isLive = isLivePaymentAvailable();
  
  return {
    mode: isLive ? 'live' : 'demo',
    ready: factory.isReady(),
    processor: 'duffel'
  };
}

export { PaymentService, DuffelPaymentProcessor, ThreeDSecureHandler };
export type { PaymentServiceConfig, ThreeDSecureConfig };