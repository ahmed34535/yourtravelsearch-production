import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';
import { PricingService } from '../services/PricingService';

export function PricingDemo() {
  const examples = PricingService.getExamples();
  const sampleCalculation = PricingService.calculateFlightPrice(500);
  const breakdown = PricingService.getPricingBreakdown(500);
  const duffelValidation = PricingService.validateDuffelExample();

  return (
    <div className="space-y-6">
      {/* Formula Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Pricing Formula Implementation
          </CardTitle>
          <CardDescription>
            Accounts for Duffel's 2.9% payment processing fee while preserving 2% profit margin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Formula</h4>
            <div className="font-mono text-lg">
              Final Price = (Base Price + 2% Markup) / (1 - 0.029)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Components</h4>
              <div className="text-sm space-y-1">
                <div>• Base Price: Airline's original fare</div>
                <div>• 2% Markup: Your profit margin</div>
                <div>• 2.9% Processing Fee: Duffel's payment fee</div>
                <div>• Final Price: What customer pays</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Key Benefits</h4>
              <div className="text-sm space-y-1">
                <div>• Preserves exact 2% profit margin</div>
                <div>• Covers all payment processing costs</div>
                <div>• Customer sees single final price</div>
                <div>• No hidden fees or surprises</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Example: $500 Flight Calculation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Step-by-Step Calculation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span className="font-mono">$500.00</span>
                </div>
                <div className="flex justify-between">
                  <span>2% Markup:</span>
                  <span className="font-mono">$10.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Price + Markup:</span>
                  <span className="font-mono">$510.00</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>÷ (1 - 0.029):</span>
                  <span className="font-mono">÷ 0.971</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Final Customer Price:</span>
                  <span className="font-mono text-green-600">
                    ${sampleCalculation.customerPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Internal Breakdown</h4>
              <div className="text-xs text-gray-600 mb-2">
                (Not shown to customers)
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span className="font-mono">{breakdown.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Your Markup:</span>
                  <span className="font-mono">{breakdown.markup}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="font-mono">{breakdown.processingFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Customer Pays:</span>
                  <span className="font-mono">{breakdown.finalPrice}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Your Profit:</span>
                  <span className="font-mono">{breakdown.profitMargin}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Customer Pricing Examples
          </CardTitle>
          <CardDescription>
            Final prices shown to customers (markup and fees included)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {examples.map((example, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-sm text-gray-600">Base Price</div>
                <div className="font-mono text-lg">${example.base}</div>
                <div className="text-xs text-gray-500">↓</div>
                <div className="text-sm text-gray-600">Customer Pays</div>
                <Badge className="w-full bg-green-100 text-green-800">
                  {example.formatted}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium mb-2">Customer Display Rules</h4>
            <div className="text-sm space-y-1">
              <div>✓ Show only the final calculated price</div>
              <div>✓ No separate markup or fee lines</div>
              <div>✓ Price includes all costs and profit</div>
              <div>✓ Transparent single-price model</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duffel Documentation Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Official Duffel Documentation Validation</CardTitle>
          <CardDescription>
            Confirming exact compliance with Duffel's pricing guidelines and industry standards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Duffel's Official Example</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-mono">{duffelValidation.duffelExample}</div>
                </div>
                <div className="text-xs text-gray-600">
                  From Duffel documentation: "((€120 + €1) × 0.85) / (1 - 0.029) = £105.92"
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Our Implementation</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-mono">{duffelValidation.ourEquivalent}</div>
                </div>
                <div className="text-xs text-gray-600">
                  Using same formula: "(Base + 2% Markup) / (1 - 0.029)"
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Formula Validation</h4>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Exact formula match: {duffelValidation.formulaMatch ? 'Confirmed' : 'Error'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Industry Standard</h4>
              <div className="text-xs">{duffelValidation.industryStandard}</div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Customer Display</h4>
              <div className="text-xs">Final price only (no markup breakdown shown)</div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium mb-2">Official Compliance Confirmed</h4>
            <div className="text-sm space-y-1">
              <div>✓ Uses Duffel's exact pricing formula</div>
              <div>✓ 2% markup within their 2-6% recommended range</div>
              <div>✓ Accounts for 2.9% Duffel Payments processing fee</div>
              <div>✓ Customer sees only final price (no breakdown)</div>
              <div>✓ Preserves exact profit margin after fees</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Monthly Projections</h4>
              <div className="space-y-1 text-sm">
                <div>100 flights × $10 avg profit = <strong>$1,000</strong></div>
                <div>500 flights × $15 avg profit = <strong>$7,500</strong></div>
                <div>1000 flights × $20 avg profit = <strong>$20,000</strong></div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Profit Preservation</h4>
              <div className="space-y-1 text-sm">
                <div>• Exact 2% maintained on all flights</div>
                <div>• Processing fees fully covered</div>
                <div>• No profit erosion from fees</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Competitive Advantage</h4>
              <div className="space-y-1 text-sm">
                <div>• Single transparent price</div>
                <div>• No surprise charges</div>
                <div>• Professional pricing model</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}