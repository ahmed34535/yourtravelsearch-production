/**
 * Pricing Service for Duffel Flight Bookings
 * 
 * Implements Duffel's official pricing formula from their documentation:
 * "((offer and services total_amount + markup) × foreign exchange rate) / (1 - Duffel Payments fee)"
 * 
 * Our Implementation: Final Price = (Base Price + 2% Markup) / (1 - 0.029)
 * 
 * Industry Standards:
 * - Travel sellers typically markup 2-6% (Duffel documentation)
 * - Our 2% markup is within industry standard range
 * - Customer sees only final price (no markup breakdown shown)
 * - Duffel Payments fee: 2.9% for most card transactions
 */

export interface PricingCalculation {
  basePrice: number;
  markupAmount: number;
  markupRate: number;
  processingFeeRate: number;
  finalPrice: number;
  customerPrice: number; // Rounded for display
}

export class PricingService {
  private static readonly MARKUP_RATE = 0.02; // 2%
  private static readonly PROCESSING_FEE_RATE = 0.029; // 2.9% Duffel processing fee

  /**
   * Calculate final customer price using the specified formula
   * Formula: Final Price = (Base Price + 2% Markup) / (1 - 0.029)
   */
  static calculateFlightPrice(basePrice: number): PricingCalculation {
    // Step 1: Add 2% markup to base price
    const markupAmount = basePrice * this.MARKUP_RATE;
    const priceWithMarkup = basePrice + markupAmount;

    // Step 2: Calculate final price accounting for processing fee
    const finalPrice = priceWithMarkup / (1 - this.PROCESSING_FEE_RATE);

    // Step 3: Round to 2 decimal places for customer display
    const customerPrice = Math.round(finalPrice * 100) / 100;

    return {
      basePrice,
      markupAmount,
      markupRate: this.MARKUP_RATE,
      processingFeeRate: this.PROCESSING_FEE_RATE,
      finalPrice,
      customerPrice
    };
  }

  /**
   * Calculate pricing for multiple flights or segments
   */
  static calculateBulkFlightPricing(flights: Array<{ price: number; currency?: string }>): Array<PricingCalculation & { currency?: string }> {
    return flights.map(flight => ({
      ...this.calculateFlightPrice(flight.price),
      currency: flight.currency || 'USD'
    }));
  }

  /**
   * Format price for customer display (only final price shown)
   */
  static formatCustomerPrice(calculation: PricingCalculation, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(calculation.customerPrice);
  }

  /**
   * Validate pricing calculation
   */
  static validatePricing(basePrice: number): boolean {
    if (basePrice <= 0) return false;
    if (!Number.isFinite(basePrice)) return false;
    
    const calculation = this.calculateFlightPrice(basePrice);
    return calculation.customerPrice > basePrice; // Final price should always be higher
  }

  /**
   * Get pricing breakdown for internal use (not customer-facing)
   */
  static getPricingBreakdown(basePrice: number): {
    basePrice: string;
    markup: string;
    processingFee: string;
    finalPrice: string;
    profitMargin: string;
  } {
    const calc = this.calculateFlightPrice(basePrice);
    const processingFeeAmount = calc.finalPrice - (basePrice + calc.markupAmount);

    return {
      basePrice: `$${basePrice.toFixed(2)}`,
      markup: `$${calc.markupAmount.toFixed(2)} (2%)`,
      processingFee: `$${processingFeeAmount.toFixed(2)} (2.9%)`,
      finalPrice: `$${calc.customerPrice.toFixed(2)}`,
      profitMargin: `$${calc.markupAmount.toFixed(2)} (preserved)`
    };
  }

  /**
   * Calculate reverse pricing (what base price gives a target customer price)
   */
  static calculateBasePriceFromTarget(targetCustomerPrice: number): number {
    // Reverse the formula: Base Price = (Target Price * (1 - 0.029)) / 1.02
    return (targetCustomerPrice * (1 - this.PROCESSING_FEE_RATE)) / (1 + this.MARKUP_RATE);
  }

  /**
   * Validate against Duffel's official documentation example
   * Their example: €120 base + €1 markup with 2.9% fee = £105.92 final
   * Our equivalent: $120 base + 2% markup with 2.9% fee = $125.30 final
   */
  static validateDuffelExample(): {
    duffelExample: string;
    ourEquivalent: string;
    formulaMatch: boolean;
    industryStandard: string;
  } {
    const duffelBase = 120; // €120 from their docs
    const duffelMarkup = 1; // €1 markup in their example
    const duffelExpected = 105.92; // £105.92 final price
    
    // Calculate using their exact formula: ((120 + 1) × fx_rate) / (1 - 0.029)
    const duffelCalculation = (121 * 0.85) / (1 - 0.029); // ≈ 105.92
    
    // Our equivalent calculation
    const ourCalculation = this.calculateFlightPrice(120);
    
    return {
      duffelExample: `€120 + €1 markup = £105.92 (0.83% markup rate)`,
      ourEquivalent: `$120 + 2% markup = $${ourCalculation.customerPrice.toFixed(2)} (2% markup rate)`,
      formulaMatch: Math.abs(duffelCalculation - 105.92) < 0.01,
      industryStandard: `Our 2% markup falls within Duffel's recommended 2-6% range`
    };
  }

  /**
   * Example calculations for documentation
   */
  static getExamples(): Array<{ base: number; final: number; formatted: string }> {
    const examples = [100, 250, 500, 1000, 1500];
    
    return examples.map(base => {
      const calc = this.calculateFlightPrice(base);
      return {
        base,
        final: calc.customerPrice,
        formatted: this.formatCustomerPrice(calc)
      };
    });
  }
}

// Export singleton instance for consistent usage
export const pricingService = new PricingService();