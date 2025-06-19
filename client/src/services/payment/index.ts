/**
 * Payment Services Entry Point
 * 
 * Comprehensive payment integration system with complete isolation
 * from the main demo application. Ready for seamless activation
 * when API keys are approved.
 */

// Core Services
export { PaymentService, PaymentServiceError } from './core/PaymentService';
export type { PaymentServiceConfig } from './core/PaymentService';

// Payment Processors
export { DuffelPaymentProcessor } from './duffel/DuffelPaymentProcessor';
export { 
  processorManager, 
  PaymentProcessorManager,
  getRecommendedProcessor,
  initializeProcessors
} from './processors';

// Security & 3D Secure
export { ThreeDSecureHandler } from './security/ThreeDSecureHandler';
export type { 
  ThreeDSecureConfig, 
  ThreeDSecureChallenge 
} from './security/ThreeDSecureHandler';

// Factory & Initialization
export { 
  PaymentServiceFactory,
  initializePaymentServices,
  isLivePaymentAvailable,
  getPaymentIntegrationStatus
} from './PaymentServiceFactory';

// Types
export type {
  PaymentMethod,
  CardDetails,
  BillingAddress,
  PaymentIntent,
  PaymentStatus,
  PaymentMetadata,
  ThreeDSecureResult,
  PaymentError,
  PaymentProcessor,
  ProcessorConfig,
  ProcessorFeatures,
  CreatePaymentIntentParams,
  PaymentResult,
  NextAction,
  ThreeDSecureParams,
  RefundResult,
  DuffelPaymentIntegration,
  DuffelOrderResult,
  DuffelPaymentResult,
  DuffelConfirmationResult,
  DuffelCancellationResult
} from './types';

// Utilities
export {
  validateCardNumber,
  detectCardBrand,
  formatCardNumber,
  maskCardNumber,
  validateExpiryDate,
  formatExpiryDate,
  validateCVC,
  validateBillingAddress,
  formatCurrency,
  toCents,
  fromCents,
  generatePaymentReference,
  validateAmount,
  sanitizePaymentMethod,
  supports3DSecure,
  generateReturnUrl,
  validateCurrency,
  calculateProcessingFee,
  requiresSCA
} from './utils/paymentHelpers';

/**
 * Quick Setup Functions
 */

/**
 * Initialize payment system in demo mode
 */
export async function initializeDemoPayments() {
  const factory = PaymentServiceFactory.getInstance();
  const config = PaymentServiceFactory.createDevelopmentConfig();
  
  try {
    const paymentService = await factory.createPaymentService(config);
    const threeDSHandler = factory.create3DSecureHandler(
      PaymentServiceFactory.createDefault3DSConfig()
    );
    
    return {
      paymentService,
      threeDSHandler,
      status: 'demo_ready'
    };
  } catch (error) {
    console.warn('[Payment] Demo initialization failed:', error);
    return {
      paymentService: null,
      threeDSHandler: null,
      status: 'demo_failed'
    };
  }
}

/**
 * Initialize payment system in live mode
 */
export async function initializeLivePayments(apiKey: string, webhookSecret?: string) {
  const factory = PaymentServiceFactory.getInstance();
  const config = PaymentServiceFactory.createProductionConfig(apiKey, webhookSecret || '');
  
  try {
    const paymentService = await factory.createPaymentService(config);
    const threeDSHandler = factory.create3DSecureHandler(
      PaymentServiceFactory.createDefault3DSConfig()
    );
    
    return {
      paymentService,
      threeDSHandler,
      status: 'live_ready'
    };
  } catch (error) {
    console.error('[Payment] Live initialization failed:', error);
    return {
      paymentService: null,
      threeDSHandler: null,
      status: 'live_failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check if payment services are configured and ready
 */
export function getPaymentStatus() {
  const factory = PaymentServiceFactory.getInstance();
  const integrationStatus = getPaymentIntegrationStatus();
  
  return {
    ...integrationStatus,
    services: {
      paymentService: factory.getPaymentService() !== null,
      threeDSecure: factory.get3DSecureHandler() !== null
    }
  };
}

/**
 * Create a payment intent for booking
 */
export async function createBookingPayment(params: {
  amount: number;
  currency: string;
  bookingType: 'flight' | 'hotel' | 'package';
  bookingId?: string;
  customerId?: string;
}) {
  const factory = PaymentServiceFactory.getInstance();
  const paymentService = factory.getPaymentService();
  
  if (!paymentService) {
    throw new Error('Payment service not initialized');
  }
  
  return await paymentService.createPaymentIntent({
    amount: params.amount,
    currency: params.currency,
    payment_method_types: ['card'],
    metadata: {
      booking_type: params.bookingType,
      booking_id: params.bookingId,
      customer_id: params.customerId
    }
  });
}

/**
 * Process a payment with 3DS support
 */
export async function processBookingPayment(
  paymentIntentId: string,
  paymentMethod: PaymentMethod
) {
  const factory = PaymentServiceFactory.getInstance();
  const paymentService = factory.getPaymentService();
  
  if (!paymentService) {
    throw new Error('Payment service not initialized');
  }
  
  return await paymentService.processPayment(paymentIntentId, paymentMethod);
}

/**
 * Default export for convenient access
 */
export default {
  initializeDemoPayments,
  initializeLivePayments,
  getPaymentStatus,
  createBookingPayment,
  processBookingPayment,
  PaymentServiceFactory,
  isLivePaymentAvailable,
  getPaymentIntegrationStatus
};

/**
 * Version information
 */
export const PAYMENT_SERVICE_VERSION = '1.0.0';
export const SUPPORTED_PROCESSORS = ['duffel'];
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
export const SUPPORTED_PAYMENT_METHODS = ['card'];

/**
 * Feature flags for payment functionality
 */
export const PAYMENT_FEATURES = {
  THREE_D_SECURE: true,
  DELAYED_CAPTURE: true,
  PARTIAL_REFUNDS: true,
  MULTI_CURRENCY: true,
  WEBHOOKS: true,
  TOKENIZATION: true
} as const;