import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Luggage, Plane, RefreshCw, CreditCard } from "lucide-react";

interface FareCondition {
  allowed: boolean;
  penalty_amount?: string;
  penalty_currency?: string;
}

interface FareConditionsProps {
  conditions: {
    change_before_departure?: FareCondition;
    refund_before_departure?: FareCondition;
  };
  totalAmount: string;
  currency: string;
  fareType: 'basic' | 'comfort' | 'flexible';
  isSelected?: boolean;
  className?: string;
}

export function FareConditions({ 
  conditions, 
  totalAmount, 
  currency, 
  fareType,
  isSelected = false,
  className = "" 
}: FareConditionsProps) {
  const fareTypeConfig = {
    basic: {
      name: 'Basic',
      description: 'Essential travel',
      color: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-900'
    },
    comfort: {
      name: 'Comfort',
      description: 'Flexible options',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-900'
    },
    flexible: {
      name: 'Flexible',
      description: 'Maximum freedom',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-900'
    }
  };

  const config = fareTypeConfig[fareType];
  const selectedClass = isSelected ? 'ring-2 ring-purple-500 border-purple-500' : '';

  const formatCondition = (type: 'change' | 'refund', condition?: FareCondition) => {
    if (!condition) {
      return { text: 'Not available', icon: XCircle, color: 'text-gray-400' };
    }

    if (!condition.allowed) {
      return { 
        text: type === 'change' ? 'Not changeable' : 'Not refundable', 
        icon: XCircle, 
        color: 'text-red-500' 
      };
    }

    if (condition.penalty_amount && parseFloat(condition.penalty_amount) > 0) {
      return { 
        text: `${type === 'change' ? 'Changeable' : 'Refundable'} (${condition.penalty_currency}${condition.penalty_amount} fee)`, 
        icon: CheckCircle, 
        color: 'text-orange-500' 
      };
    }

    return { 
      text: `Fully ${type === 'change' ? 'Changeable' : 'Refundable'}`, 
      icon: CheckCircle, 
      color: 'text-green-500' 
    };
  };

  const changeCondition = formatCondition('change', conditions.change_before_departure);
  const refundCondition = formatCondition('refund', conditions.refund_before_departure);

  return (
    <Card className={`${config.color} ${selectedClass} ${className} transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">ECONOMY</span>
              {isSelected && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Selected
                </Badge>
              )}
            </div>
            <h3 className={`text-lg font-semibold ${config.textColor}`}>
              {config.name}
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {/* Change Conditions */}
          <div className="flex items-center gap-2">
            <changeCondition.icon className={`w-4 h-4 ${changeCondition.color}`} />
            <span className="text-sm text-gray-700">{changeCondition.text}</span>
          </div>

          {/* Refund Conditions */}
          <div className="flex items-center gap-2">
            <refundCondition.icon className={`w-4 h-4 ${refundCondition.color}`} />
            <span className="text-sm text-gray-700">{refundCondition.text}</span>
          </div>

          {/* Baggage Information */}
          <div className="flex items-center gap-2">
            <Luggage className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Includes 1 carry on bag</span>
          </div>

          {fareType !== 'basic' && (
            <div className="flex items-center gap-2">
              <Luggage className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Includes 1 checked bag</span>
            </div>
          )}

          {/* Additional Services Icons */}
          <div className="flex items-center gap-1 pt-2 border-t border-gray-200">
            <Luggage className="w-4 h-4 text-gray-400" />
            <Plane className="w-4 h-4 text-gray-400" />
            <RefreshCw className="w-4 h-4 text-gray-400" />
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 ml-2">Show more</span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-right">
            <span className="text-xs text-gray-500">total amount from</span>
            <div className="text-2xl font-bold text-gray-900">
              {currency}{totalAmount}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for displaying multiple fare options side by side
export function FareOptionsDisplay({ 
  offers 
}: { 
  offers: Array<{
    id: string;
    total_amount: string;
    total_currency: string;
    conditions: FareConditionsProps['conditions'];
    fare_brand?: { name: string };
  }> 
}) {
  const getFareType = (brandName?: string): 'basic' | 'comfort' | 'flexible' => {
    if (!brandName) return 'basic';
    const name = brandName.toLowerCase();
    if (name.includes('flexible') || name.includes('premium')) return 'flexible';
    if (name.includes('comfort') || name.includes('plus') || name.includes('standard')) return 'comfort';
    return 'basic';
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {offers.slice(0, 3).map((offer, index) => (
        <FareConditions
          key={offer.id}
          conditions={offer.conditions}
          totalAmount={offer.total_amount}
          currency="£"
          fareType={getFareType(offer.fare_brand?.name)}
          isSelected={index === 2} // Typically the flexible option is pre-selected in examples
        />
      ))}
    </div>
  );
}