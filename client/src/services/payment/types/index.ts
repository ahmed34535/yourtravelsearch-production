/**
 * Payment Service Type Definitions
 * 
 * Comprehensive type system for payment processing with strong typing
 * and industry-standard compliance patterns.
 */

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'digital_wallet';
  brand?: string;
  last4?: string;
  expiry?: string;
  isDefault: boolean;
  metadata?: Record<string, unknown>;
}

export interface CardDetails {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
  address: BillingAddress;
}

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  client_secret?: string;
  confirmation_method: 'automatic' | 'manual';
  capture_method: 'automatic' | 'manual';
  metadata: PaymentMetadata;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded';

export interface PaymentMetadata {
  booking_id?: string;
  booking_type: 'flight' | 'hotel' | 'package';
  customer_id?: string;
  order_reference?: string;
  duffel_order_id?: string;
}

export interface ThreeDSecureResult {
  authenticated: boolean;
  status: '3ds_success' | '3ds_failed' | '3ds_not_required' | '3ds_challenge';
  challenge_url?: string;
  transaction_id?: string;
}

export interface PaymentError {
  code: string;
  message: string;
  type: 'card_error' | 'validation_error' | 'api_error' | 'authentication_error';
  param?: string;
  decline_code?: string;
}

export interface PaymentProcessor {
  name: string;
  initialize(config: ProcessorConfig): Promise<void>;
  createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent>;
  confirmPayment(intent_id: string, payment_method: PaymentMethod): Promise<PaymentResult>;
  handle3DSecure(params: ThreeDSecureParams): Promise<ThreeDSecureResult>;
  capturePayment(intent_id: string, amount?: number): Promise<PaymentResult>;
  refundPayment(intent_id: string, amount?: number): Promise<RefundResult>;
}

export interface ProcessorConfig {
  apiKey: string;
  environment: 'sandbox' | 'production';
  webhookSecret?: string;
  features?: ProcessorFeatures;
}

export interface ProcessorFeatures {
  supports3DS: boolean;
  supportsDelayedCapture: boolean;
  supportsPartialRefunds: boolean;
  supportedCurrencies: string[];
  supportedCountries: string[];
}

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  metadata: PaymentMetadata;
  payment_method_types: string[];
  confirmation_method?: 'automatic' | 'manual';
  capture_method?: 'automatic' | 'manual';
}

export interface PaymentResult {
  success: boolean;
  payment_intent: PaymentIntent;
  error?: PaymentError;
  requires_action?: boolean;
  next_action?: NextAction;
}

export interface NextAction {
  type: 'redirect_to_url' | 'use_stripe_sdk';
  redirect_to_url?: {
    url: string;
    return_url: string;
  };
}

export interface ThreeDSecureParams {
  payment_intent_id: string;
  return_url: string;
}

export interface RefundResult {
  success: boolean;
  refund_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  error?: PaymentError;
}

export interface DuffelPaymentIntegration {
  createOrder(offer_id: string, passengers: any[]): Promise<DuffelOrderResult>;
  addPaymentToOrder(order_id: string, payment_intent: PaymentIntent): Promise<DuffelPaymentResult>;
  confirmOrderPayment(order_id: string): Promise<DuffelConfirmationResult>;
  cancelOrder(order_id: string): Promise<DuffelCancellationResult>;
}

export interface DuffelOrderResult {
  success: boolean;
  order?: {
    id: string;
    reference: string;
    total_amount: string;
    total_currency: string;
    status: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface DuffelPaymentResult {
  success: boolean;
  payment_status?: string;
  error?: PaymentError;
}

export interface DuffelConfirmationResult {
  success: boolean;
  confirmation_number?: string;
  tickets?: any[];
  error?: PaymentError;
}

export interface DuffelCancellationResult {
  success: boolean;
  refund_amount?: string;
  refund_currency?: string;
  error?: PaymentError;
}