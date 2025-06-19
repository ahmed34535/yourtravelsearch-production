/**
 * Payment Processor Registry
 * 
 * Central registry for all payment processors with automatic
 * processor selection and fallback mechanisms.
 */

import { PaymentProcessor, ProcessorConfig } from '../types';
import { DuffelPaymentProcessor } from '../duffel/DuffelPaymentProcessor';

export interface ProcessorRegistry {
  [key: string]: new () => PaymentProcessor;
}

export const AVAILABLE_PROCESSORS: ProcessorRegistry = {
  duffel: DuffelPaymentProcessor
};

export class PaymentProcessorManager {
  private processors: Map<string, PaymentProcessor> = new Map();
  private activeProcessor: PaymentProcessor | null = null;

  /**
   * Register a payment processor
   */
  registerProcessor(name: string, processor: PaymentProcessor): void {
    this.processors.set(name, processor);
  }

  /**
   * Get available processor names
   */
  getAvailableProcessors(): string[] {
    return Array.from(this.processors.keys());
  }

  /**
   * Initialize and activate a processor
   */
  async activateProcessor(name: string, config: ProcessorConfig): Promise<PaymentProcessor> {
    const ProcessorClass = AVAILABLE_PROCESSORS[name];
    
    if (!ProcessorClass) {
      throw new Error(`Payment processor '${name}' not found`);
    }

    const processor = new ProcessorClass();
    await processor.initialize(config);
    
    this.processors.set(name, processor);
    this.activeProcessor = processor;
    
    return processor;
  }

  /**
   * Get active processor
   */
  getActiveProcessor(): PaymentProcessor | null {
    return this.activeProcessor;
  }

  /**
   * Get processor by name
   */
  getProcessor(name: string): PaymentProcessor | null {
    return this.processors.get(name) || null;
  }

  /**
   * Check processor availability
   */
  isProcessorAvailable(name: string): boolean {
    return name in AVAILABLE_PROCESSORS;
  }

  /**
   * Get processor capabilities
   */
  getProcessorCapabilities(name: string): {
    supports3DS: boolean;
    supportsDelayedCapture: boolean;
    supportsPartialRefunds: boolean;
    supportedCurrencies: string[];
  } {
    const capabilities: Record<string, any> = {
      duffel: {
        supports3DS: true,
        supportsDelayedCapture: true,
        supportsPartialRefunds: true,
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
      }
    };

    return capabilities[name] || {
      supports3DS: false,
      supportsDelayedCapture: false,
      supportsPartialRefunds: false,
      supportedCurrencies: ['USD']
    };
  }

  /**
   * Auto-select best processor based on requirements
   */
  selectOptimalProcessor(requirements: {
    currency?: string;
    requires3DS?: boolean;
    requiresDelayedCapture?: boolean;
    region?: string;
  }): string {
    const available = Object.keys(AVAILABLE_PROCESSORS);
    
    // For now, default to Duffel as it has the most comprehensive feature set
    if (available.includes('duffel')) {
      const capabilities = this.getProcessorCapabilities('duffel');
      
      // Check currency support
      if (requirements.currency && 
          !capabilities.supportedCurrencies.includes(requirements.currency)) {
        // Could add fallback logic here for other processors
      }
      
      // Check 3DS requirement
      if (requirements.requires3DS && !capabilities.supports3DS) {
        // Could add fallback logic here
      }
      
      return 'duffel';
    }
    
    throw new Error('No suitable payment processor available');
  }

  /**
   * Reset all processors
   */
  reset(): void {
    this.processors.clear();
    this.activeProcessor = null;
  }
}

// Global processor manager instance
export const processorManager = new PaymentProcessorManager();

/**
 * Initialize default processors
 */
export function initializeProcessors(): void {
  // Processors are registered via AVAILABLE_PROCESSORS registry
  // They will be instantiated when needed
}

/**
 * Get recommended processor for a given context
 */
export function getRecommendedProcessor(context: {
  amount: number;
  currency: string;
  region?: string;
  bookingType: 'flight' | 'hotel' | 'package';
}): string {
  // For travel bookings, Duffel is optimized
  if (['flight', 'hotel', 'package'].includes(context.bookingType)) {
    return 'duffel';
  }
  
  return processorManager.selectOptimalProcessor({
    currency: context.currency,
    requires3DS: context.amount > 3000, // SCA threshold
    region: context.region
  });
}

export { DuffelPaymentProcessor };